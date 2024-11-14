import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesGuard } from 'src/common/guards/role.guards';
import { Role } from './enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { LoggedInUser } from 'src/common/decorators/login-user.decorator';
import { RestApiResponseObject } from 'src/common/decorators/api-response-object.decorator';
import { RestApiResponseArray } from 'src/common/decorators/api-response-array.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RestApiResponseObject(GetUserDto, 'User has been successfully created', 'User creation', 'User')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() body: CreateUserDto, @LoggedInUser() user: UserEntity): Promise<GetUserDto> {
    return await this.userService.create(body, user);
  }

  @RestApiResponseArray(GetUserDto, 'Get all users', 'Find all users', 'User')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@LoggedInUser() user: UserEntity): Promise<GetUserDto[]> {
    return await this.userService.findAll(user);
  }

  @RestApiResponseObject(GetUserDto, 'Find user by id', 'Find user', 'User')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @LoggedInUser() user: UserEntity,
  ): Promise<GetUserDto> {
    return await this.userService.update(id, body, user);
  }

  @RestApiResponseObject(GetUserDto, 'Password has been successfully updated', 'Update password', 'User')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put(':id/password')
  async updatePassword(
    @Param('id') id: number,
    @Body() body: UpdatePasswordDto,
    @LoggedInUser() user: UserEntity,
  ): Promise<GetUserDto> {
    return await this.userService.updatePassword(id, body, user);
  }

  @RestApiResponseObject(GetUserDto, 'User has been successfully deleted', 'Delete user', 'User')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @LoggedInUser() user: UserEntity): Promise<void> {
    return await this.userService.delete(id, user);
  }
}
