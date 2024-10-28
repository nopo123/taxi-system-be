import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { SetupHelpers } from '../../src/setup/helpers/setup.helpers';
import {
  SetupData,
  SetupTestingData,
} from '../../src/setup/interfaces/setup-services.interface';
import request from 'supertest';
import { CreateOrganizationDto } from '../../src/organization/dto/create-organization.dto';

describe('Organization Testing', () => {
  const TEST_NAME = 'organizationTesting';
  const ORGANIZATIONS_COUNT = 3;
  const ORGANIZATION_NAME = 'Test Organization';
  const ORGANIZATION_ADDRESS = '123 Main Street';

  let app: INestApplication;
  let httpServer: HttpServer;
  let superAdminToken: string;
  let data: SetupData;
  let testHelper: SetupHelpers;

  beforeAll(async () => {
    testHelper = new SetupHelpers();
    const setupData: SetupTestingData = await testHelper.createSetupApp({
      testName: TEST_NAME,
      organizations: {
        count: ORGANIZATIONS_COUNT,
      },
      users: {
        count: 3,
      },
    });
    app = setupData.app;
    httpServer = app.getHttpServer();
    data = setupData.data;
    superAdminToken = setupData.tokens.superAdminToken;
  });

  it('Create Organization [POST /organization]', async () => {
    const createOrganizationDto: CreateOrganizationDto = {
      name: ORGANIZATION_NAME,
      address: ORGANIZATION_ADDRESS,
    };

    return request(app.getHttpServer())
      .post('/organization')
      .send(createOrganizationDto)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.name).toEqual(ORGANIZATION_NAME);
        expect(body.address).toEqual(ORGANIZATION_ADDRESS);
        expect(body.users).toEqual([]);
      });
  });

  it('Find All Organizations [GET /organization]', async () => {
    return request(app.getHttpServer())
      .get('/organization')
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.length).toEqual(ORGANIZATIONS_COUNT + 1);
      });
  });

  it('Find One Organization [GET /organization/:id]', async () => {
    return request(app.getHttpServer())
      .get(`/organization/${data.organizations[0].id}`)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.id).toEqual(data.organizations[0].id);
        expect(body.name).toEqual(data.organizations[0].name);
        expect(body.address).toEqual(data.organizations[0].address);
      });
  });

  it('Update Organization [PUT /organization/:id]', async () => {
    const updateOrganizationDto: CreateOrganizationDto = {
      name: 'Updated Organization Name',
      address: '456 Updated Address',
    };

    return request(app.getHttpServer())
      .put(`/organization/${data.organizations[0].id}`)
      .send(updateOrganizationDto)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.name).toEqual(updateOrganizationDto.name);
        expect(body.address).toEqual(updateOrganizationDto.address);
      });
  });

  it('Delete Organization [DELETE /organization/:id]', async () => {
    return request(app.getHttpServer())
      .delete(`/organization/${data.organizations[0].id}`)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
