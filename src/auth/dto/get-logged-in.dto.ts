import { IsObject, IsString } from 'class-validator';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class GetLoggedInDto {
  @IsString()
  readonly access_token: string;

  @IsObject()
  readonly user: GetUserDto;
}
