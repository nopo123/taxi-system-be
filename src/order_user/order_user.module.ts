import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderUserEntity } from './entities/order-user.entity';
import { OrderUserService } from './order_user.service';
import { OrderUserController } from './order_user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderUserEntity]),
    JwtModule.register({ secret: process.env.JWT_TOKEN }),
  ],
  controllers: [OrderUserController],
  providers: [OrderUserService],
  exports: [OrderUserService],
})
export class OrderUserModule {}
