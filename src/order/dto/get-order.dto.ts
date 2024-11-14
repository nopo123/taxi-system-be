import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { GetUserDto } from 'src/user/dto/get-user.dto';

export class GetOrderDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly route: string;

  @IsString()
  readonly date: Date;

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

  @IsOptional()
  @IsString()
  readonly driverSignature?: string;

  @IsOptional()
  @IsString()
  readonly clientSignature?: string;

  @IsOptional()
  @IsObject()
  @Type(() => GetUserDto)
  readonly user?: GetUserDto | null;
}
