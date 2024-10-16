import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";
import { GetUserDto } from "src/user/dto/get-user.dto";

export class GetOrganizationDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsArray()
  @Type(() => GetUserDto)
  users: GetUserDto[];
}