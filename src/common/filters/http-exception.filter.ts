import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';
import { ErrorService } from '../../error/error.service';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {

  constructor(private readonly errorService: ErrorService) {
  }

  catch(exception: T, host: ArgumentsHost) {

    console.log('>> HttpExceptionFilter called');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    this.errorService.create({ message: error.toString() }).then(() => console.debug('Error traced:', error));

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}
