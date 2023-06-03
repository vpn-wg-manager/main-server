import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import Error from '@/shared/Errors/Error';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(400).json({
      statusCode: 400,
      message: 'Error',
      error: exception,
    });
  }
}
