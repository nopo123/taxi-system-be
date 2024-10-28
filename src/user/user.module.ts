import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import {OrganizationService} from "../organization/organization.service";
import {OrderService} from "../order/order.service";
import {OrderUserService} from "../order_user/order_user.service";
import {OrderUserEntity} from "../order_user/entities/order-user.entity";
import {OrganizationEntity} from "../organization/entities/organization.entity";
import {OrderEntity} from "../order/entities/order.entity";
import {AppService} from "../app.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      OrderUserEntity,
      OrderEntity,
    ]),
    JwtModule.register({ secret: process.env.JWT_TOKEN }),
  ],
  controllers: [UserController],
  providers: [AppService, UserService, OrderUserService, OrganizationService, OrderService],
  exports: [UserService],
})
export class UserModule {}
