import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { TasksController, TasksService, TaskFindMiddleware, Task } from './';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [
    TasksController,
  ],
  providers: [
    TasksService,
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
