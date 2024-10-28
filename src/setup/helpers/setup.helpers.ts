import { SetupTestingEntitiesHelpers } from './setup-testing-entities.helpers';
import {
  Services,
  SetupConfig,
  SetupTestingData,
  Tokens,
} from '../interfaces/setup-services.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import {
  DynamicModule,
  ForwardReference,
  HttpStatus,
  ModuleMetadata,
  Provider, ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../app.module';
import { UserModule } from '../../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Connection } from 'typeorm';
import { GetUserDto } from '../../user/dto/get-user.dto';
import request from 'supertest';
import { OrganizationService } from '../../organization/organization.service';
import { RolesService } from '../../roles/roles.service';
import { OrganizationEntity } from '../../organization/entities/organization.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import {LoginUserDto} from "../../auth/dto/user-login.dto";
import {join} from "path";
import {AllExceptionsFilter} from "../../common/filters/all-exceptions.filter";
import {customExceptionFactory} from "../../common/helpers/validation.helper";
import {OrganizationModule} from "../../organization/organization.module";
import {OrderService} from "../../order/order.service";
import {OrderUserService} from "../../order_user/order_user.service";
import {AuthModule} from "../../auth/auth.module";
import {OrderEntity} from "../../order/entities/order.entity";
import {OrderUserEntity} from "../../order_user/entities/order-user.entity";

config();

export class SetupHelpers {
  private testingEntitiesHelper: SetupTestingEntitiesHelpers;

  async createSetupApp(config: SetupConfig): Promise<SetupTestingData> {
    const { moduleMetaData } = this.prepareModuleMetaData();

    const moduleFixture = await Test.createTestingModule(
      moduleMetaData,
    ).compile();

    const services: Services = this.setupServices(moduleFixture);

    const app: NestExpressApplication = moduleFixture.createNestApplication();
    await app.init();
    if (process.env.NODE_ENV === 'test') {
      const connection = app.get(Connection);
      await connection.dropDatabase();
      await connection.synchronize(true);
    }

    this.testingEntitiesHelper = new SetupTestingEntitiesHelpers(services);
    const data = await this.testingEntitiesHelper.createTestingData(config);
    const tokens = await this.createSetupTokens(
      data.superAdmin,
      data.admins[0],
      app,
    );

    return {
      app,
      data,
      tokens,
    };
  }

  prepareModuleMetaData(): { moduleMetaData: ModuleMetadata } {
    const imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [
      AppModule,
      UserModule,
      AuthModule,
      JwtModule.register({ secret: process.env.JWT_SECRET }),
      TypeOrmModule.forFeature([
        UserEntity,
        OrganizationEntity,
        RolesEntity,
        OrderEntity,
        OrderUserEntity,
      ]),
    ];

    const providers: Provider[] = [UserService, AuthService, OrganizationService, RolesService, OrderService, OrderUserService];

    return {
      moduleMetaData: {
        imports: imports,
        providers: providers,
      },
    };
  }

  setupServices(moduleFixture: TestingModule): Services {
    const usersService: UserService =
      moduleFixture.get<UserService>(UserService);
    const organizationService: OrganizationService =
      moduleFixture.get<OrganizationService>(OrganizationService);
    const rolesService: RolesService =
      moduleFixture.get<RolesService>(RolesService);
  const orderService: OrderService =
      moduleFixture.get<OrderService>(OrderService);
  const orderUserService: OrderUserService =
      moduleFixture.get<OrderUserService>(OrderUserService);
  return {
      usersService,
      organizationService,
      rolesService,
      orderService,
      orderUserService,
    };
  }

  async createSetupTokens(
    superAdmin: GetUserDto,
    admin: GetUserDto | UserEntity,
    app: NestExpressApplication,
  ): Promise<Tokens> {
    let superAdminToken: string;
    let adminToken: string;

    const superAdminLoginDto: LoginUserDto = {
      email: superAdmin.email,
      password: process.env.LOCAL_PASSWORD,
    };

    const adminLoginDto: LoginUserDto = {
      email: admin.email,
      password: process.env.LOCAL_PASSWORD,
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(superAdminLoginDto)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        superAdminToken = res.body.access_token;
      });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(adminLoginDto)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        adminToken = res.body.access_token;
      });


    return {
      superAdminToken,
      adminToken,
    };
  }
}
