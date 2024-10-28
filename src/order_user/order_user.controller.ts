import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { OrderUserService } from './order_user.service';
import {UserEntity} from "../user/entities/user.entity";
import {LoggedInUser} from "../common/decorators/login-user.decorator";
import {RolesGuard} from "../common/guards/role.guards";
import {Role} from "../user/enums/role.enum";
import {Roles} from "../common/decorators/role.decorator";

@Controller('order-user')
export class OrderUserController {
  constructor(private readonly orderUserService: OrderUserService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@LoggedInUser() user: UserEntity) {
    return await this.orderUserService.findAll(user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @LoggedInUser() user: UserEntity) {
    return await this.orderUserService.remove(id, user);
  }
}
