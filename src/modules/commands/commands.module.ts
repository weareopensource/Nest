import { AuthenticationModule, AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewaresConsumer, OnModuleInit } from '@nestjs/common';
import { CommandsController, CommandsService, CommandFindMiddleware } from './';
import { DatabaseModule } from '../database/database.module';
import { CommandDatabaseConfig } from './command.database.config';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';

@Module({
  modules: [ DatabaseModule ],
  controllers: [
    CommandsController,
  ],
  components: [
    CommandsService,
    { provide: TypeOrmDatabaseConfig, useClass: CommandDatabaseConfig },
  ],
})
export class CommandModule /* implements NestModule */ {
  public configure(consumer: MiddlewaresConsumer) {
//    consumer.apply(CommandFindMiddleware).forRoutes({
//      path: 'commands/:id', method: RequestMethod.ALL,
//    });
//    consumer.apply(AuthenticationMiddleware).forRoutes({
//      path: 'commands/', method: RequestMethod.ALL,
//    });
  }
}
