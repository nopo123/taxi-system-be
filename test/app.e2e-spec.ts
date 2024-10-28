import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {SetupData, SetupTestingData} from "../src/setup/interfaces/setup-services.interface";
import {SetupHelpers} from "../src/setup/helpers/setup.helpers";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let superAdminToken: string;
  let data: SetupData;
  let testHelper: SetupHelpers;
  let operatorToken: string;

  beforeAll(async () => {

    testHelper = new SetupHelpers();
    const setupData: SetupTestingData = await testHelper.createSetupApp({
      testName: 'app' ,
      users: { count: 1 },
      organizations: { count: 1 }
    });

    app = setupData.app;
    superAdminToken = setupData.tokens.superAdminToken;
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/hello').expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
