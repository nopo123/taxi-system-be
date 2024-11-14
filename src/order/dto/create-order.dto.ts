import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsNumber()
  @IsOptional()
  readonly orderUserId?: number | null;

  @IsString()
  readonly route: string;

  @IsString()
  readonly date: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  readonly price: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  readonly distance: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  readonly secondDriver: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly waitingTime: number;

  @IsString()
  readonly driverSignature: string;

  @IsString()
  readonly clientSignature: string;
}
