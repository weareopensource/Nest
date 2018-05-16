import { ExceptionFilter, Catch } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, response) {
    const message = exception.message;
    response.cookie('XSRF-TOKEN', '', { maxAge: 0 });
    response.status(403).json({
      statusCode: 403,
      message,
    });
  }
}
