import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { TaskFindMiddleware } from './middlewares/task.find.middleware';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user';
import { TaskByIdPipe } from './pipes/task-by-id.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [
    TaskController,
  ],
  providers: [
    TaskService,
    TaskByIdPipe,
  ],
})
export class TaskModule /* implements NestModule */ {
  public configure(consumer: MiddlewareConsumer) {
//    consumer.apply(TaskFindMiddleware).forRoutes({
//      path: 'commands/:id', method: RequestMethod.ALL,
//    });
//    consumer.apply(AuthenticationMiddleware).forRoutes({
//      path: 'commands/', method: RequestMethod.ALL,
//    });
  }
}
