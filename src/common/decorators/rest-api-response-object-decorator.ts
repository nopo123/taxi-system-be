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
  BadRequestDto,
  ForbiddenDto,
  InternalServerErrorDto,
  NotFoundDto,
  UnauthorizedDto,
} from '../dto/exception-dto';

export const RestApiResponseObject = <TModel extends Type<any>>(
  model: TModel,
  description: string,
  okDescription: string,
  summary: string,
  groupName: string,
) => {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiTags(groupName),
    ApiOkResponse({
      description: okDescription,
      type: model,
    }),
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
