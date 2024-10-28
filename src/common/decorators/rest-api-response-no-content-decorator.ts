import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse, // Add this import statement
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

import {
  BadRequestDto,
  ForbiddenDto,
  InternalServerErrorDto,
  NotFoundDto,
  UnauthorizedDto,
} from '../dto/exception-dto';

export const RestApiResponseNoContentDecorator = (
  description: string,
  okDescription: string,
  summary: string,
  groupName: string,
) => {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiTags(groupName),
    ApiNoContentResponse({ description: 'No Content' }), // Add this line
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: BadRequestDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      type: NotFoundDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: InternalServerErrorDto,
    }),
  );
};
