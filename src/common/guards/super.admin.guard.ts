import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { config } from 'dotenv';
config();

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    return token === process.env.GENERATED_TOKEN;
  }
}
