import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { AppService } from 'src/app.service';
import { OrganizationEntity } from 'src/organization/entities/organization.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationService } from 'src/organization/organization.service';
import { OrderService } from 'src/order/order.service';
import { OrderUserEntity } from 'src/order_user/entities/order-user.entity';
import { OrderUserService } from 'src/order_user/order_user.service';

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
  providers: [UserService, OrganizationService, OrderService, OrderUserService],
  exports: [UserService],
})
export class UserModule {}
