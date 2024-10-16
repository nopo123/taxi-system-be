import { GetOrderUserDto } from "../dto/get-order-user.dto";
import { OrderUserEntity } from "../entities/order-user.entity";

export const mapOrderUserToGetOrderUserDto = (orderUser: OrderUserEntity): GetOrderUserDto => {
  return {
    id: orderUser.id,
    firstName: orderUser.firstName,
    lastName: orderUser.lastName,
  };
}