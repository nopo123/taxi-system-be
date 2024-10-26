import { IsString } from "class-validator";

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  address: string;
}