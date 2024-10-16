import { IsNumber } from "class-validator";

export class GetOrderUserDto {
  @IsNumber()
  readonly id: number;

  @IsNumber()
  readonly firstName: string;

  @IsNumber()
  readonly lastName: string;
}