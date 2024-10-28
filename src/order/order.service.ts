import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { mapOrderToGetOrderDto } from './mappers/order.mapper';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import PDFDocument from 'pdfkit';
import {OrganizationService} from "../organization/organization.service";
import {UserService} from "../user/user.service";
import {OrderUserService} from "../order_user/order_user.service";
import {GetUserDto} from "../user/dto/get-user.dto";
import {Role} from "../user/enums/role.enum";


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => OrderUserService))
    private readonly orderUserService: OrderUserService,
  ) {}

  async create(body: CreateOrderDto, loggedUser: UserEntity): Promise<GetOrderDto> {
    const foundUser: GetUserDto = await this.userService.findOne(body.userId, loggedUser);

    if (
      (loggedUser.organizationId === null || foundUser.organizationId === null) &&
      loggedUser.role !== Role.SUPER_ADMIN
    ) {
      throw new NotFoundException('Používateľ nie je súčasťou organizácie');
    }

    if (!body.orderUserId) {
      await this.orderUserService.create(body.firstName, body.lastName, loggedUser);
    }

    const createdOrder: OrderEntity = this.orderRepository.create({
      ...body,
      organizationId: loggedUser.organizationId,
      userId: foundUser.id,
      user: foundUser,
    });

    const savedOrder = await this.orderRepository.save(createdOrder);
    return mapOrderToGetOrderDto(savedOrder);
  }

  async findAll(loggedUser: UserEntity, page: number): Promise<GetOrderDto[]> {
    let orders: OrderEntity[] = [];
    if (loggedUser.role === Role.SUPER_ADMIN) {
      await this.orderRepository.find({
        order: { date: 'DESC' },
        skip: page,
        take: 20,
      });
    } else if (loggedUser.role === Role.ADMIN) {
      orders = await this.orderRepository.find({
        where: {
          organizationId: loggedUser.organizationId,
        },
        order: { date: 'DESC' },
        skip: page,
        take: 20,
      });
    } else {
      orders = await this.orderRepository.find({
        where: {
          userId: loggedUser.id,
        },
        order: { date: 'DESC' },
        skip: page,
        take: 20,
      });
    }

    return orders.map((order: OrderEntity) => mapOrderToGetOrderDto(order));
  }

  async findOne(id: number, loggedUser: UserEntity): Promise<GetOrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Objednávka nebola nájdená');
    }

    if (order.organizationId !== loggedUser.organizationId) {
      throw new ForbiddenException('Objednávka nie je súčasťou organizácie');
    }

    return mapOrderToGetOrderDto(order);
  }

  async update(id: number, body: UpdateOrderDto, loggedUser: UserEntity): Promise<GetOrderDto> {
    const order = await this.orderRepository.findOne({ where: { id: id } });

    if (!order) {
      throw new NotFoundException('Objednávka nebola nájdená');
    }

    if (order.organizationId !== loggedUser.organizationId) {
      throw new ForbiddenException('Objednávka nie je súčasťou organizácie');
    }

    const updatedOrder = await this.orderRepository.save({
      id: order.id,
      ...order,
      ...body,
    });

    if (!updatedOrder.orderUserId) {
      await this.orderUserService.create(body.firstName, body.lastName, loggedUser);
    }

    return mapOrderToGetOrderDto(updatedOrder);
  }

  async delete(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Objednávka nebola nájdená');
    }

    await this.orderRepository.delete({ id: id });
  }

  async getPdf(loggedUser: UserEntity, from: string, to: string): Promise<any> {
    const fromObj = new Date(from);
    const toObj = new Date(to);

    if (isNaN(fromObj.getTime()) || isNaN(toObj.getTime())) {
      throw new ForbiddenException('Neplatný dátum');
    }
    if (fromObj > toObj) {
      throw new ForbiddenException('Dátum od je väčší ako dátum do');
    }
    if (loggedUser.organizationId === null) {
      throw new ForbiddenException('Používateľ nie je súčasťou organizácie');
    }

    const orders: OrderEntity[] = await this.orderRepository.find({
      where: {
        organizationId: loggedUser.organizationId,
        date: Between(fromObj, toObj),
      },
      relations: ['user'],
      order: { date: 'ASC' },
    });

    const organization = await this.organizationService.findOne(loggedUser.organizationId);

    if (orders.length === 0) {
      throw new NotFoundException('Žiadne objednávky neboli nájdené');
    }

    const pdfDoc = new PDFDocument();
    const chunks: Buffer[] = [];
    pdfDoc.font('fonts/Roboto-Regular.ttf');
    pdfDoc.fontSize(24);
    pdfDoc.text(organization.name, { align: 'center' });
    pdfDoc.fontSize(20);
    pdfDoc.text(`Výkaz za mesiac ${fromObj.getMonth() + 1}.${fromObj.getFullYear()}`, { align: 'center' });
    pdfDoc.moveDown();

    pdfDoc.fontSize(12);
    orders.forEach((order: OrderEntity, index: number) => {
      if (index > 0) {
        pdfDoc.addPage();
      }
      const orderDate = new Date(order.date);
      const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;
      pdfDoc.text(`Objednávka/Order č: ${index + 1}`, { align: 'center' });
      pdfDoc.moveDown();
      pdfDoc.text(`Dátum/Date: ${order.date.toLocaleDateString('sk-SK')}`);
      pdfDoc.text(`Čas/Time: ${formattedTime}`);
      pdfDoc.text(`Hlavný vodič/Main driver: ${order.user.firstName} ${order.user.lastName}`);
      pdfDoc.text(`Pasažier/Passenger: ${order.user.firstName} ${order.user.lastName}`);
      pdfDoc.text(`Celková suma/Total price: ${order.price}€`);
      pdfDoc.text(`Km/taxi: ${order.distance} km`);
      pdfDoc.text(`Trasa/Route: ${order.route}`);
      pdfDoc.text(`Druhý vodič/Second driver: ${order.secondDriver}`);
      pdfDoc.text(`Čakanie/Waiting: ${order.waitingTime} min`);
      pdfDoc.text('Podpis pasažiera/Passenger signature:');
      pdfDoc.image(order.clientSignature, 100, pdfDoc.y, { width: 200 });
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      pdfDoc.text('Podpis vodiča/Driver signature:');
      pdfDoc.image(order.driverSignature, 100, pdfDoc.y, { width: 200 });
      pdfDoc.moveDown();
    });

    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    return new Promise<Buffer>((resolve) => {
      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      pdfDoc.end();
    });
  }
}
