import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { SetupHelpers } from '../../src/setup/helpers/setup.helpers';
import {
  SetupData,
  SetupTestingData,
} from '../../src/setup/interfaces/setup-services.interface';
import { Role } from '../../src/user/enums/role.enum';
import {CreateUserDto} from "../../src/user/dto/create-user.dto";
import request from 'supertest';
import { CreateSuperAdminDto } from 'src/user/dto/create-super-admin.dto';


describe('Users Testing', () => {
  const TEST_NAME = 'usersTesting';
  const USERS_COUNT = 3;
  const ORGANIZATIONS_COUNT = 3;
  const FIRST_NAME = 'firstName';
  const LAST_NAME = 'lastName';

  let app: INestApplication;
  let httpServer: HttpServer;
  let superAdminToken: string;
  let adminToken: string;
  let data: SetupData;
  let testHelper: SetupHelpers;

  beforeAll(async () => {
    testHelper = new SetupHelpers();
    const setupData: SetupTestingData = await testHelper.createSetupApp({
      testName: TEST_NAME,
      users: {
        count: USERS_COUNT,
      },
      organizations: {
        count: ORGANIZATIONS_COUNT,
      },
    });
    app = setupData.app;
    httpServer = app.getHttpServer();
    data = setupData.data;
    superAdminToken = setupData.tokens.superAdminToken;
    adminToken = setupData.tokens.adminToken;
  });


  it('Create User [POST /user]', async () => {

    const createUserDto: CreateUserDto = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: 'asosUser1@mail.com',
      password: 'password',
      role: Role.ADMIN,
      organizationId: data.organizations[0].id,
    }
    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {

        expect(body.firstName).toEqual(FIRST_NAME);
        expect(body.lastName).toEqual(LAST_NAME);
        expect(body.email).toEqual(createUserDto.email);
        expect(body.role).toEqual(Role.ADMIN);
        expect(body.organizationId).toEqual(data.organizations[0].id);
      });
  });

  it('Create Super Admin [POST /user/super-admin]', async () => {
    const createSuperAdminDto: CreateSuperAdminDto = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: 'superAdminTest1@mail.com',
      password: 'password'
    }

    return request(app.getHttpServer())
      .post('/user/super-admin')
      .send(createSuperAdminDto)
      .expect(HttpStatus.NOT_FOUND)
  });

  it('Find All Users [GET /user]', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .auth(adminToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.length).toEqual(USERS_COUNT + 1);
      });
  });

  it('Update User [PUT /user/:id]', async () => {
    const createUserDto: CreateUserDto = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: 'asosUser@mail.com',
      password: 'password',
      role: Role.USER,
      organizationId: data.organizations[0].id,
    }

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.firstName).toEqual(FIRST_NAME);
        expect(body.lastName).toEqual(LAST_NAME);
        expect(body.email).toEqual(createUserDto.email);
        expect(body.role).toEqual(Role.USER);
        expect(body.organizationId).toEqual(data.organizations[0].id);

        const updateUserDto: CreateUserDto = {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: 'asosUser@mail.com',
          password: 'password',
          role: Role.ADMIN,
          organizationId: data.organizations[0].id,
        }

        return request(app.getHttpServer())
          .put(`/user/${body.id}`)
          .send(updateUserDto)
          .auth(superAdminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.firstName).toEqual(FIRST_NAME);
            expect(body.lastName).toEqual(LAST_NAME);
            expect(body.email).toEqual(updateUserDto.email);
            expect(body.role).toEqual(Role.ADMIN);
            expect(body.organizationId).toEqual(data.organizations[0].id);
          });
      });
  });

  it('Update User Password [PUT /user/:id/password]', async () => {
    const createUserDto: CreateUserDto = {
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: 'asos@mail.com',
      password: 'password',
      role: Role.USER,
      organizationId: data.organizations[0].id,
    }

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.firstName).toEqual(FIRST_NAME);
        expect(body.lastName).toEqual(LAST_NAME);
        expect(body.email).toEqual(createUserDto.email);
        expect(body.role).toEqual(Role.USER);
        expect(body.organizationId).toEqual(data.organizations[0].id);

        const updatePasswordDto = {
          password: 'password',
          confirmPassword: 'password',
        }

        return request(app.getHttpServer())
          .put(`/user/${body.id}/password`)
          .send(updatePasswordDto)
          .auth(superAdminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.firstName).toEqual(FIRST_NAME);
            expect(body.lastName).toEqual(LAST_NAME);
            expect(body.email).toEqual(createUserDto.email);
            expect(body.role).toEqual(Role.USER);
            expect(body.organizationId).toEqual(data.organizations[0].id);
          });
      });
  });

  it('Delete User [DELETE /user/:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${data.admins[0].id}`)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
    
    return request(app.getHttpServer())
      .get(`/user/${data.admins[0].id}`)
      .auth(superAdminToken, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND)
  });

  afterAll(async () => {
    await app.close();
  });
});
