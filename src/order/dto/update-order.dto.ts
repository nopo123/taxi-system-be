import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  orderUserId: number;

  @IsString()
  route: string;

  @IsString()
  date: string;

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
}
