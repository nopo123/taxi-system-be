import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/user/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_TOKEN;

    try {
      const decodedToken = this.jwtService.verify(token, { secret: secret });
      const permissionRole = decodedToken['role'];

      return requiredRoles.some((role: Role) => role === permissionRole);
    } catch (error) {
      return false;
    }
  }
}