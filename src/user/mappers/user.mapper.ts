import { OrderEntity } from 'src/order/entities/order.entity';
import { GetUserDto } from '../dto/get-user.dto';
import { UserEntity } from '../entities/user.entity';
import {mapOrderToGetOrderDtoWithoutUser} from "../../order/mappers/order.mapper";

export const mapUserToGetUserDto = (user: UserEntity): GetUserDto => {
  return {
    id: user.id,
    organizationId: user.organizationId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    orders: user.orders
      ? user.orders.map((order: OrderEntity) =>
          mapOrderToGetOrderDtoWithoutUser(order),
        )
      : [],
  };
};
