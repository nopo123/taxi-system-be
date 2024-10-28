import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesEntity } from './entities/roles.entity';

@Module({
  providers: [AppService, RolesService],
  imports: [
    TypeOrmModule.forFeature([RolesEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
