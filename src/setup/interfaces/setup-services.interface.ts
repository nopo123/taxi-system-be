import { UserService } from '../../user/user.service';
import { GetUserDto } from '../../user/dto/get-user.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { NestExpressApplication } from '@nestjs/platform-express';
import { OrganizationService } from '../../organization/organization.service';
import { OrganizationEntity } from '../../organization/entities/organization.entity';
import { GetOrganizationDto } from '../../organization/dto/get-organization.dto';
import {GetRolesDto} from "../../roles/dto/get-roles.dto";
import {RolesService} from "../../roles/roles.service";
import {OrderService} from "../../order/order.service";
import {OrderUserService} from "../../order_user/order_user.service";
import { OrderEntity } from 'src/order/entities/order.entity';
import { GetOrderDto } from 'src/order/dto/get-order-dto';
import { GetOrderUserDto } from 'src/order_user/dto/get-order-user.dto';
import { OrderUserEntity } from 'src/order_user/entities/order-user.entity';

export interface SetupTestingData {
  app: NestExpressApplication;
  data: SetupData;
  tokens: Tokens;
}

export interface SetupData {
  superAdmin?: GetUserDto;
  admins?: UserEntity[] | GetUserDto[];
  organizations?: OrganizationEntity[] | GetOrganizationDto[];
  orders?: OrderEntity[] | GetOrderDto[];
  orderUsers?: GetOrderUserDto[] | OrderUserEntity[];
  rolesTypes?: GetRolesDto[];
}

export interface Services {
  usersService: UserService;
  organizationService: OrganizationService;
  rolesService: RolesService;
  orderService: OrderService;
  orderUserService: OrderUserService;
}

export interface SetupConfig {
  testName: string;
  users?: {
    count: number;
  };
  organizations?: {
    count: number;
  };
  rolesTypes?: {
    count: number;
  };
  orders?: {
    count: number;
  };
  orderUsers?: {
    count: number;
  };
}

export interface Tokens {
  superAdminToken: string;
  adminToken: string;
}
