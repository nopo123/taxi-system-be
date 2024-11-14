import { IsString, IsEmail, IsNumber, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(3, { message: 'Password is too short' })
  readonly password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;

  @IsNumber()
  @IsNotEmpty()
  readonly organizationId: number;
}
