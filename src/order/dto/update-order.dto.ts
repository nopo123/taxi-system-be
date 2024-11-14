import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly orderUserId: number;

  @IsString()
  readonly route: string;

  @IsString()
  readonly date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  readonly price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  readonly distance: number;

  @IsNumber()
  readonly secondDriver: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  readonly waitingTime: number;
}
