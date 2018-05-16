import { AuthenticationModule, AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { CommandsController, CommandsService, CommandFindMiddleware, Command } from './';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Command]),
  ],
  controllers: [
    CommandsController,
  ],
  providers: [
    CommandsService,
  ],
})
export class CommandModule /* implements NestModule */ {
  public configure(consumer: MiddlewareConsumer) {
//    consumer.apply(CommandFindMiddleware).forRoutes({
//      path: 'commands/:id', method: RequestMethod.ALL,
//    });
//    consumer.apply(AuthenticationMiddleware).forRoutes({
//      path: 'commands/', method: RequestMethod.ALL,
//    });
  }
}
