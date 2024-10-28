import { IsString } from 'class-validator';

export class ErrorDto {
  @IsString()
  readonly message: string;
}
