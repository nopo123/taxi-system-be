import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateRolesDto {
  @ApiProperty({
    description: 'type of organization',
  })
  @IsString()
  readonly type: string;
}
