import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({ description: 'ID a user.', example: '42' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The first name of a user.', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of a user.', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email name of a user.',
    example: 'john.doe@fmdt.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The department name of a user.',
    example: 'Bratislava',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsString()
  role: string;
}
