import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedDto {
  @ApiProperty({ description: 'Error message', example: 'Unauthorized' })
  message: string;

  @ApiProperty({ description: 'Error status code', example: 401 })
  statusCode: number;
}

export class NotFoundDto {
  @ApiProperty({ description: 'Error message', example: 'Not found' })
  message: string;

  @ApiProperty({ description: 'Error status code', example: 404 })
  statusCode: number;
}

export class BadRequestDto {
  @ApiProperty({ description: 'Error message', example: 'Bad request' })
  message: string;

  @ApiProperty({ description: 'Error status code', example: 400 })
  statusCode: number;
}

export class InternalServerErrorDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error',
  })
  message: string;

  @ApiProperty({ description: 'Error status code', example: 500 })
  statusCode: number;
}

export class ForbiddenDto {
  @ApiProperty({ description: 'Error message', example: 'Forbidden' })
  message: string;

  @ApiProperty({ description: 'Error status code', example: 403 })
  statusCode: number;
}
