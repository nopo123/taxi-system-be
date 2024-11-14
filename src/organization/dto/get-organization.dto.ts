import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { GetUserDto } from 'src/user/dto/get-user.dto';

export class GetOrganizationDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string;

  @IsArray()
  @Type(() => GetUserDto)
  readonly users: GetUserDto[];
}
