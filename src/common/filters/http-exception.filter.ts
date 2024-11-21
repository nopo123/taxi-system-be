import { Catch, HttpException, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '../../error/error.service';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private readonly errorService: ErrorService) {}
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error('Error message:', exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof response === 'string' ? { message: exceptionResponse } : (exceptionResponse as object);

    this.errorService.create({ message: error.toString() }).then(() => console.debug('Error traced:', error));

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}
