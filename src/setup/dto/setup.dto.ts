import { IsInt, IsOptional, IsString } from 'class-validator';

export class SetupDto {
  @IsString()
  readonly title: string;

  @IsInt()
  @IsOptional()
  readonly users?: number;
}
