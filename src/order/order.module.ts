import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { OrganizationEntity } from 'src/organization/entities/organization.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderUserEntity } from 'src/order_user/entities/order-user.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';
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
  controllers: [OrderController],
  providers: [OrderService, OrganizationService, UserService, OrderUserService],
  exports: [OrderService],
})
export class OrderModule {}
