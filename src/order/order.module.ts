import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {UserEntity} from "../user/entities/user.entity";
import {OrganizationEntity} from "../organization/entities/organization.entity";
import {OrderUserEntity} from "../order_user/entities/order-user.entity";
import {OrganizationService} from "../organization/organization.service";
import {UserService} from "../user/user.service";
import {OrderUserService} from "../order_user/order_user.service";
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
  controllers: [OrderController],
  providers: [AppService, OrderService, OrganizationService, UserService, OrderUserService],
  exports: [OrderService],
})
export class OrderModule {}
