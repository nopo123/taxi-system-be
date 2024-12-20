import { Injectable, Logger } from '@nestjs/common';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { mapOrganizationToGetOrganizationDto } from './mappers/organization.mapper';
import { Connection, EntityManager } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
  ) {}

  private readonly logger = new Logger(OrganizationService.name);

  async create(body: CreateOrganizationDto): Promise<GetOrganizationDto> {
    const foundOrganization = await this.organizationRepository.findOne({
      where: { name: body.name },
    });
    if (foundOrganization) {
      this.logger.error(`Organization with name: ${body.name} already exists`);
      throw new Error('Organizácia s týmto názvom už existuje');
    }

    const createdOrganization = this.organizationRepository.create({
      ...body,
      users: [],
    });

    this.logger.log(`Creating organization with name: ${body.name}`);
    await this.organizationRepository.save(createdOrganization);
    return mapOrganizationToGetOrganizationDto(createdOrganization);
  }

  async findAll(): Promise<GetOrganizationDto[]> {
    const organizations = await this.organizationRepository.find({
      relations: ['users'],
    });
    this.logger.log(`Returning ${organizations.length} organizations`);
    return organizations.map((organization: OrganizationEntity) => mapOrganizationToGetOrganizationDto(organization));
  }

  async findOne(id: number): Promise<GetOrganizationDto> {
    this.logger.log(`Finding organization with id: ${id}`);
    const organization: OrganizationEntity = await this.organizationRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });
    if (!organization) {
      throw new Error('Organizácia nebola nájdená');
    }

    this.logger.log(`Returning organization with id: ${id}`);
    return mapOrganizationToGetOrganizationDto(organization);
  }

  async update(id: number, body: CreateOrganizationDto): Promise<GetOrganizationDto> {
    this.logger.log(`Finding organization with id: ${id}`);
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new Error('Organizácia nebola nájdená');
    }

    const updatedOrganization = await this.organizationRepository.save({
      ...organization,
      ...body,
    });

    this.logger.log(`Updating organization with id: ${id}`);
    return mapOrganizationToGetOrganizationDto(updatedOrganization);
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting organization with id: ${id}`);
    await this.connection.transaction(async (entityManager: EntityManager) => {
      const organization = await entityManager.findOne(OrganizationEntity, {
        where: { id },
        relations: ['users'],
      });

      if (!organization) {
        this.logger.error(`Organization with id: ${id} not found`);
        throw new Error('Organizácia nebola nájdená');
      }

      for (const user of organization.users) {
        const userWithOrders = await entityManager.findOne(UserEntity, {
          where: { id: user.id },
          relations: ['orders'],
        });

        if (userWithOrders && userWithOrders.orders) {
          for (const order of userWithOrders.orders) {
            await entityManager.remove(OrderEntity, order);
          }
        }
        await entityManager.remove(UserEntity, user);
      }
      await entityManager.remove(OrganizationEntity, organization);
    });

    this.logger.log(`Organization with id: ${id} deleted successfully`);
  }
}
