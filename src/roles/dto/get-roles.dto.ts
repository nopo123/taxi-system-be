// @ts-ignore
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetRolesDto {
  @ApiProperty({ description: 'id', example: 1 })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: 'type', example: 'type name' })
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'created date in string format',
    example: '1.1.2000',
  })
  @IsString()
  readonly created: string;

  @ApiProperty({
    description: 'updated date in string format',
    example: '1.1.2000',
  })
  @IsString()
  readonly updated: string;
}
