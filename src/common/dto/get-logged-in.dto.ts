import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetOrganizationNoUsersDto } from '../../organization/dto/get-no-users-organization.dto';

export class GetLoggedInDto {
  @ApiProperty({ description: 'id for user', example: 1 })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: 'firstName for user', example: 'LastName' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: 'lastName for user', example: 'FirstName' })
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: 'email for user',
    example: 'worker-system@email.com',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'nationality', example: 'svk' })
  @IsString()
  readonly nationality: string;

  @ApiProperty({ description: 'role for user', example: ['admin'] })
  @IsArray()
  readonly roles: string[];

  @ApiProperty({
    description: 'created date in string format for user',
    example: '1.1.2000',
  })
  @IsString()
  readonly created: string;

  @ApiProperty({
    description: 'updated date in string format for user',
    example: '1.1.2000',
  })
  @IsString()
  readonly updated: string;

  @ApiProperty({ description: 'created by user id', example: 1 })
  @IsNumber()
  readonly createdBy: number;

  @ApiProperty({ description: 'updated by user id', example: 1 })
  @IsNumber()
  readonly updatedBy: number;

  @ApiProperty({ description: 'organization' })
  @IsObject()
  readonly organization: GetOrganizationNoUsersDto;
}
