import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { JwtModule } from '@nestjs/jwt';
import {UserEntity} from "../user/entities/user.entity";
import {OrderEntity} from "../order/entities/order.entity";
import {OrderUserEntity} from "../order_user/entities/order-user.entity";
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
  controllers: [OrganizationController],
  providers: [AppService, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
