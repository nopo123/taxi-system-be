import { mapUserToGetUserDto } from 'src/user/mappers/user.mapper';
import { GetOrderDto } from '../dto/get-order.dto';
import { OrderEntity } from '../entities/order.entity';

export const mapOrderToGetOrderDto = (order: OrderEntity): GetOrderDto => {
  return {
    id: order.id,
    firstName: order.firstName,
    lastName: order.lastName,
    route: order.route,
    date: order.date,
    price: order.price,
    distance: order.distance,
    secondDriver: order.secondDriver,
    waitingTime: order.waitingTime,
    driverSignature: order.driverSignature,
    clientSignature: order.clientSignature,
    user: order.user ? mapUserToGetUserDto(order.user) : null,
  };
};

export const mapOrderToGetOrderDtoWithoutUser = (order: OrderEntity): GetOrderDto => {
  return {
    id: order.id,
    firstName: order.firstName,
    lastName: order.lastName,
    route: order.route,
    date: order.date,
    price: order.price,
    distance: order.distance,
    secondDriver: order.secondDriver,
    waitingTime: order.waitingTime,
  };
};
