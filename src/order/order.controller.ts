import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { GetOrderDto } from './dto/get-order-dto';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guards';
import { Role } from 'src/user/enums/role.enum';
import { Response } from 'express';
import { LoggedInUser } from 'src/common/decorators/login-user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() body: CreateOrderDto,
    @LoggedInUser() user: UserEntity,
  ): Promise<GetOrderDto> {
    return await this.orderService.create(body, user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/pdf')
  async getPdf(
    @Query('from') date: string,
    @Query('to') to: string,
    @LoggedInUser() user: UserEntity,
  ): Promise<any> {
    return await this.orderService.getPdf(user, date, to);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @LoggedInUser() user: UserEntity,
    @Query('page') page: number,
  ): Promise<GetOrderDto[]> {
    return await this.orderService.findAll(user, page);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @LoggedInUser() user: UserEntity,
  ): Promise<GetOrderDto> {
    return await this.orderService.findOne(id, user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateOrderDto,
    @LoggedInUser() user: UserEntity,
  ): Promise<GetOrderDto> {
    return await this.orderService.update(id, body, user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.orderService.delete(id);
  }
}
