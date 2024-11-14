import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { OrderUserService } from './order_user.service';
import { UserEntity } from '../user/entities/user.entity';
import { LoggedInUser } from '../common/decorators/login-user.decorator';
import { RolesGuard } from '../common/guards/role.guards';
import { Role } from '../user/enums/role.enum';
import { Roles } from '../common/decorators/role.decorator';
import { GetOrderUserDto } from './dto/get-order-user.dto';
import { RestApiResponseObject } from '../common/decorators/api-response-object.decorator';
import { RestApiResponseArray } from '../common/decorators/api-response-array.decorator';

@Controller('order-user')
export class OrderUserController {
  constructor(private readonly orderUserService: OrderUserService) {}

  @RestApiResponseArray(
    GetOrderUserDto,
    'All order users have been successfully found',
    'Find all order users',
    'OrderUser',
  )
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@LoggedInUser() user: UserEntity): Promise<GetOrderUserDto[]> {
    return await this.orderUserService.findAll(user);
  }

  @RestApiResponseObject(null, 'Order users have been successfully deleted', 'Delete order users', 'OrderUser')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @LoggedInUser() user: UserEntity): Promise<void> {
    return await this.orderUserService.remove(id, user);
  }
}
