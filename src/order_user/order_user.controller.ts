import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderUserService } from './order_user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guards';
import { Role } from 'src/user/enums/role.enum';
import { LoggedInUser } from 'src/common/decorators/login-user.decorator';

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
