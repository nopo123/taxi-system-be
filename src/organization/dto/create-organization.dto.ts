import { IsString } from "class-validator";

export class CreateOrganiationDto {
  @IsString()
  name: string;

  @IsString()
  address: string;
}