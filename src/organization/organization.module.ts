import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderUserEntity } from 'src/order_user/entities/order-user.entity';

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
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
