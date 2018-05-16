import { Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  components: [ LoggerMiddleware ],
  exports: [ LoggerMiddleware ],
})
export class CommonModule { }