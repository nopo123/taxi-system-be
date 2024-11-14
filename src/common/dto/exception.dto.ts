import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ExceptionForbiddenDto {
  @ApiProperty({ description: 'Error message', example: 'Forbidden' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Error status code', example: 403 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  statusCode: number;
}

export class ExceptionUnauthorizedDto {
  @ApiProperty({ description: 'Error message', example: 'Unauthorized' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Error status code', example: 401 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  statusCode: number;
}

export class ExceptionNotFoundDto {
  @ApiProperty({ description: 'Error message', example: 'Not Found' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Error status code', example: 404 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  statusCode: number;
}

export class ExceptionBadRequestDto {
  @ApiProperty({ description: 'Error message', example: 'Bad Request' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Error status code', example: 400 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  statusCode: number;
}

export class ExceptionInternalServerErrorDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Internal Server Error',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Error status code', example: 500 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  statusCode: number;
}
