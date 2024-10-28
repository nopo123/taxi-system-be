import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolesDto } from './dto/create-roles.dto';
import { RestApiResponseObject } from '../common/decorators/rest-api-response-object-decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';
import { GetRolesDto } from './dto/get-roles.dto';
import { GetUserDto } from '../user/dto/get-user.dto';
import { RestApiResponseArray } from '../common/decorators/rest-api-response-array-decorator';
import {LoggedInUser} from "../common/decorators/login-user.decorator";
import { RolesGuard } from 'src/common/guards/role.guards';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @RestApiResponseObject(
    GetRolesDto,
    'Only for super admin. Create roles',
    'Successfully created roles',
    'Create roles',
    'Roles',
  )
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRoles(
    @Body() createRolesDto: CreateRolesDto,
    @LoggedInUser() user: GetUserDto,
  ): Promise<GetRolesDto> {
    return await this.roleService.createRoles(user, createRolesDto);
  }

  @RestApiResponseArray(
    GetRolesDto,
    'Only for super admin. Get all roles',
    'Successfully get all roles',
    'Get all roles',
    'Roles',
  )
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @HttpCode(HttpStatus.CREATED)
  async getAll(): Promise<GetRolesDto[]> {
    return await this.roleService.findAll();
  }
}
