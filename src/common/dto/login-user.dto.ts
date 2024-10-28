import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'log in email',
    example: 'worker-system@email.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'log in password', example: 'pass123' })
  @IsString()
  readonly password: string;
}
