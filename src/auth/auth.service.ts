import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { mapUserToGetUserDto } from 'src/user/mappers/user.mapper';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './guards/constants';
import { verifyPassword } from 'src/common/helpers/password.helper';
import { LoginUserDto } from './dto/user-login.dto';
import { GetLoggedInDto } from './dto/get-logged-in.dto';

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
