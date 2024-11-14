import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { RolesGuard } from 'src/common/guards/role.guards';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/user/enums/role.enum';
import { RestApiResponseObject } from 'src/common/decorators/api-response-object.decorator';
import { RestApiResponseArray } from 'src/common/decorators/api-response-array.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @RestApiResponseObject(
    GetOrganizationDto,
    'The organization has been successfully created',
    'The organization has been created',
    'Organization',
  )
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() body: CreateOrganizationDto): Promise<GetOrganizationDto> {
    return await this.organizationService.create(body);
  }

  @RestApiResponseArray(
    GetOrganizationDto,
    'All organizations have been successfully found',
    'Find all organizations',
    'Organization',
  )
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<GetOrganizationDto[]> {
    return await this.organizationService.findAll();
  }

  @RestApiResponseObject(null, 'Find organization by id', 'Organization was found by id', 'Organization')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<GetOrganizationDto> {
    return await this.organizationService.findOne(id);
  }

  @RestApiResponseObject(
    GetOrganizationDto,
    'The organization has been successfully updated',
    'The organization has been updated',
    'Organization',
  )
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: CreateOrganizationDto): Promise<GetOrganizationDto> {
    return await this.organizationService.update(id, body);
  }

  @RestApiResponseObject(null, 'Organization has been successfully deleted', 'Delete organization', 'Organization')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.organizationService.delete(id);
  }
}
