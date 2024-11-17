import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderUserEntity } from './entities/order-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { mapOrderUserToGetOrderUserDto } from './mappers/order-user.mapper';
import { GetOrderUserDto } from './dto/get-order-user.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class OrderUserService {
  constructor(
    @InjectRepository(OrderUserEntity)
    private readonly orderUserRepository: Repository<OrderUserEntity>,
  ) {}

  async create(firstName: string, lastName: string, loggedUser: UserEntity): Promise<void> {
    if (loggedUser.organizationId === null) {
      throw new NotFoundException('Organizácia nebola nájdená');
    }

    const createdOrderUser: OrderUserEntity = this.orderUserRepository.create({
      firstName,
      lastName,
      organizationId: loggedUser.organizationId,
    });

    await this.orderUserRepository.save(createdOrderUser);
  }

  async findAll(user: UserEntity): Promise<GetOrderUserDto[]> {
    const orderUsers: OrderUserEntity[] = await this.orderUserRepository.find({
      where: { organizationId: user.organizationId },
    });

    return orderUsers.map((orderUser: OrderUserEntity) => mapOrderUserToGetOrderUserDto(orderUser));
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    const orderUser: OrderUserEntity = await this.orderUserRepository.findOne({
      where: { id, organizationId: user.organizationId },
    });

    if (!orderUser) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (orderUser.organizationId !== user.organizationId) {
      throw new NotFoundException('Používateľ nie je súčasťou organizácie');
    }

    await this.orderUserRepository.delete({ id: orderUser.id });
  }
}
