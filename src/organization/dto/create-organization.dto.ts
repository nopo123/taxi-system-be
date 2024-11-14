import { IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string;
}
