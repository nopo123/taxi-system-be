import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { LoginUserDto } from './dto/user-login.dto';
import { GetLoggedInDto } from './dto/get-logged-in.dto';
import {mapUserToGetUserDto} from "../user/mappers/user.mapper";
import {UserService} from "../user/user.service";
import {verifyPassword} from "../common/helpers/password.helper";

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser (email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Nie ste autorizovaný')
    }

    const isPasswordMatching = await verifyPassword(user.password, password)

    if (isPasswordMatching) {
      const { ...result } = user
      return result
    }
    throw new UnauthorizedException('Nie ste autorizovaný')
  }

  async login(user: LoginUserDto): Promise<GetLoggedInDto> {
    const fetchedUser = await this.usersService.findUserByEmail(user.email);

    if (!fetchedUser) {
      throw new UnauthorizedException('Nie ste autorizovaný');
    }
    
    const payload = {
      email: user.email,
      sub: fetchedUser.id,
      role: fetchedUser.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });

    return {
      access_token: token,
      user: mapUserToGetUserDto(fetchedUser),
    };
  }
}
