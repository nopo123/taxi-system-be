import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/user-login.dto';
import { GetLoggedInDto } from './dto/get-logged-in.dto';

@Controller('auth')
export class AuthController {
}
