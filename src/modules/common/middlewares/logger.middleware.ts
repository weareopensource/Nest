// import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Middleware, NestMiddleware, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  resolve(name: string): any {
    return (req, res, next) => {
      console.log(`[${name}] Request...`); // [ApplicationModule] Request...
      next();
    };
 }
}
