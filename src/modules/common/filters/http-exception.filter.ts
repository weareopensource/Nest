import { ExceptionFilter, Catch } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, response) {
    const status = exception.getStatus();
    const message = exception.getResponse();
    response.cookie('XSRF-TOKEN', '', { maxAge: 0 });
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
