import { IsNumber, IsString, IsEmail, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { GetOrderDto } from 'src/order/dto/get-order.dto';

export class GetUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly firstName: string;

  @IsNumber()
  readonly organizationId: number;

  @IsString()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly role: string;

  @IsArray()
  @Type(() => GetOrderDto)
  readonly orders: GetOrderDto[];
}
