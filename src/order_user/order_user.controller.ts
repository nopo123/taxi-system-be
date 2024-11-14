import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderUserService } from './order_user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guards';
import { Role } from 'src/user/enums/role.enum';
import { LoggedInUser } from 'src/common/decorators/login-user.decorator';
import { GetOrderUserDto } from './dto/get-order-user.dto';
import { RestApiResponseObject } from 'src/common/decorators/api-response-object.decorator';
import { RestApiResponseArray } from 'src/common/decorators/api-response-array.decorator';

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
