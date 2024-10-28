import { IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class LoggedInDto {
  @ApiProperty({ description: 'access token', example: 'long string' })
  @IsString()
  readonly access_token: string;

  @ApiProperty({
    description: 'Object of user data',
  })
  @IsObject()
  readonly user: GetUserDto;
}
