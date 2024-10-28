import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { SetupHelpers } from '../../src/setup/helpers/setup.helpers';
import {
  SetupData,
  SetupTestingData,
} from '../../src/setup/interfaces/setup-services.interface';
import request from 'supertest';
import { CreateOrderDto } from '../../src/order/dto/create-order.dto';
import { UpdateOrderDto } from '../../src/order/dto/update-order.dto';
import { IsNumber } from 'class-validator';

describe('Order Testing', () => {
  const TEST_NAME = 'orderTesting';
  const ORDERS_COUNT = 3;
  const ORDER_ROUTE = 'Route 66';
  const ORDER_DATE = '2024-10-27';
  const ORDER_PRICE = 120;
  const ORDER_DISTANCE = 150;
  const ORDER_SECOND_DRIVER = 0;
  const ORDER_WAITING_TIME = 10;
  const ORDER_DRIVER_SIGNATURE = 'DriverSignature';
  const ORDER_CLIENT_SIGNATURE = 'ClientSignature';

  let app: INestApplication;
  let httpServer: HttpServer;
  let superAdminToken: string;
  let userToken: string;
  let data: SetupData;
  let testHelper: SetupHelpers;
  let adminToken: string;

  beforeAll(async () => {
    testHelper = new SetupHelpers();
    const setupData: SetupTestingData = await testHelper.createSetupApp({
      testName: TEST_NAME,
      orders: {
        count: ORDERS_COUNT,
      },
      users: {
        count: 3,
      },
      organizations: {
        count: 2,
      },
    });
    app = setupData.app;
    httpServer = app.getHttpServer();
    data = setupData.data;
    superAdminToken = setupData.tokens.superAdminToken;
    adminToken = setupData.tokens.adminToken;
  });

    it('Create Order [POST /order]', async () => {
    const createOrderDto: CreateOrderDto = {
        route: ORDER_ROUTE,
        date: ORDER_DATE,
        price: ORDER_PRICE,
        distance: ORDER_DISTANCE,
        secondDriver: ORDER_SECOND_DRIVER,
        waitingTime: ORDER_WAITING_TIME,
        driverSignature: ORDER_DRIVER_SIGNATURE,
        clientSignature: ORDER_CLIENT_SIGNATURE,
        userId: data.admins[0].id,
        firstName: 'firstName',
        lastName: 'lastName',
    };

    return request(app.getHttpServer())
        .post('/order')
        .send(createOrderDto)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED);
    });

    it('Update Order [PUT /order/:id]', async () => {
    const updateOrderDto: UpdateOrderDto = {
        route: 'Route 67',
        date: '2024-10-28',
        price: 130,
        distance: 160,
        secondDriver: 1,
        waitingTime: 20,
        lastName: 'lastName',
        firstName: 'firstName',
        orderUserId: data.admins[2].id,

    };

    return request(app.getHttpServer())
        .put(`/order/${data.orders[0].id}`)
        .send(updateOrderDto)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('Find All Orders [GET /order]', async () => {
        return request(app.getHttpServer())
            .get('/order')
            .auth(adminToken, { type: 'bearer' })
            .expect(HttpStatus.OK)
            .then(({ body }) => {
            expect(body.length).toEqual(ORDERS_COUNT + 1);
        });
    });

    it('Find Order By Id [GET /order/:id]', async () => {
        return request(app.getHttpServer())
            .get(`/order/${data.orders[1].id}`)
            .auth(adminToken, { type: 'bearer' })
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body.route).toEqual(data.orders[1].route);
                expect(parseInt(body.price)).toEqual(data.orders[1].price);
                expect(parseInt(body.distance)).toEqual(data.orders[1].distance);
                expect(parseInt(body.secondDriver)).toEqual(data.orders[1].secondDriver);
                expect(parseInt(body.waitingTime)).toEqual(data.orders[1].waitingTime);
                expect(body.driverSignature).toEqual(data.orders[1].driverSignature);
                expect(body.clientSignature).toEqual(data.orders[1].clientSignature);
        });
    });

    it('Delete Order [DELETE /order/:id]', async () => {
        return request(app.getHttpServer())
            .delete(`/order/${data.orders[1].id}`)
            .auth(superAdminToken, { type: 'bearer' })
            .expect(HttpStatus.OK);
    });


  afterAll(async () => {
    await app.close();
  });
});
