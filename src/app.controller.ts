import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { GetLoggedInDto } from './auth/dto/get-logged-in.dto';
import { LoginUserDto } from './auth/dto/user-login.dto';
import { Public } from './common/decorators/public.decorator';
import { UserEntity } from './user/entities/user.entity';
import { LoggedInUser } from './common/decorators/login-user.decorator';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService,
    private readonly usersService: UserService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('auth/login')
  async login(@Body() body: LoginUserDto): Promise<GetLoggedInDto> {
    return await this.authService.login(body);
  }

  @Get('/auth/me')
  async getProfile(
    @LoggedInUser() loggedInUser: UserEntity,
  ): Promise<UserEntity> {
    return await this.usersService.findUserByEmail(loggedInUser.email);
  }
}
