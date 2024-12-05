import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const i18n = I18nContext.current(host);

    const exceptionResponse = exception.getResponse() as any;
    let message = exceptionResponse.message;

    // Translate the error message if it's a key in our translations
    if (typeof message === 'string' && message.includes('errors.')) {
      message = i18n.t(message);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exceptionResponse.error,
      ...(exceptionResponse.errors && { errors: exceptionResponse.errors }),
    });
  }
}
