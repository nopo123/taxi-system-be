import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  @IsOptional()
  orderUserId?: number | null;

  @IsString()
  route: string;

  @IsString()
  date: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  distance: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  secondDriver: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  waitingTime: number;

  @IsString()
  driverSignature: string;

  @IsString()
  clientSignature: string;
}