import { IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class GetLoggedInDto {
  @IsString()
  readonly access_token: string;

  @ValidateNested()
  @Type(() => GetUserDto)
  @IsObject()
  readonly user: GetUserDto;
}
