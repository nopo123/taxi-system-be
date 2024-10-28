import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from './guards/constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import {AppService} from "../app.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '5d' },
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
