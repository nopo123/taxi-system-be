import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import {
  ExceptionBadRequestDto,
  ExceptionForbiddenDto,
  ExceptionInternalServerErrorDto,
  ExceptionNotFoundDto,
  ExceptionUnauthorizedDto,
} from '../dto/exception.dto';

export const RestApiResponseArray = <TModel extends Type<any>>(
  model: TModel,
  description: string,
  summary: string,
  groupName: string,
) => {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiTags(groupName),
    ApiOkResponse({
      description: 'Success',
      isArray: true,
      type: model,
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ExceptionBadRequestDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ExceptionUnauthorizedDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ExceptionForbiddenDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      type: ExceptionNotFoundDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: ExceptionInternalServerErrorDto,
    }),
  );
};
