import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganiationDto } from './dto/create-organization.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';
import {RolesGuard} from "../common/guards/role.guards";
import {Role} from "../user/enums/role.enum";
import {Roles} from "../common/decorators/role.decorator";

@Controller('organization')
export class OrganizationController {

  constructor(
    private readonly organizationService: OrganizationService
  ){}

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() body: CreateOrganiationDto): Promise<GetOrganizationDto> {
    return await this.organizationService.create(body)
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<GetOrganizationDto[]> {
    return await this.organizationService.findAll();
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<GetOrganizationDto> {
    return await this.organizationService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: CreateOrganiationDto): Promise<GetOrganizationDto> {
    return await this.organizationService.update(id, body);
  }


  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.organizationService.delete(id);
  }

}
