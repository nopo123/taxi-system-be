import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';
import { CreateRolesDto } from './dto/create-roles.dto';
import { GetRolesDto } from './dto/get-roles.dto';
import { mapRoleToGetRoleDto } from './mapper/get-roles.mapper';
import { GetUserDto } from '../user/dto/get-user.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesEntityRepository: Repository<RolesEntity>,
  ) {}

  async createRoles(
    logInUser: GetUserDto,
    createRolesDto: CreateRolesDto,
  ): Promise<GetRolesDto> {
    const roles = await this.rolesEntityRepository.create({
      ...createRolesDto,
    });
    const savedRoles = await this.rolesEntityRepository.save(roles);
    return mapRoleToGetRoleDto(savedRoles);
  }

  async findAll(): Promise<GetRolesDto[]> {
    const roles = await this.rolesEntityRepository.find();
    return roles.map((role) => mapRoleToGetRoleDto(role));
  }
}
