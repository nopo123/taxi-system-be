import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        status: 'fail',
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception instanceof NotFoundException
          ? exception.message
          : exception.getResponse()
        : null;

    // TODO: match fail vs error like https://github.com/omniti-labs/jsend

    if (status == HttpStatus.BAD_REQUEST) {
      const exceptionResponse: any = exception instanceof HttpException ? exception.getResponse() : {};

      return response.status(status).json({
        status: 'fail',
        message: exceptionResponse.error,
        data: exceptionResponse.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (status == HttpStatus.CONFLICT) {
      return response.status(status).json({
        status: 'fail',
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (status == HttpStatus.FORBIDDEN) {
      return response.status(status).json({
        status: 'fail',
        message: 'Forbidden resource',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    response.status(status).json({
      status: 'error',
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
