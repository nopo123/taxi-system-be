import { Type } from "class-transformer";
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { GetUserDto } from "src/user/dto/get-user.dto";

export class GetOrderDto {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  route: string;

  @IsString()
  date: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  distance: number;

  @IsNumber()
  secondDriver: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  waitingTime: number;

  @IsOptional()
  @IsString()
  driverSignature?: string;

  @IsOptional()
  @IsString()
  clientSignature?: string;

  @IsOptional()
  @IsObject()
  @Type(() => GetUserDto)
  user?: GetUserDto | null;
}