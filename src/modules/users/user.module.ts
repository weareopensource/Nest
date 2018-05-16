import { AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewaresConsumer, OnModuleInit } from '@nestjs/common';
import { UsersController, UsersService, UserFindMiddleware } from './';
import { DatabaseModule } from '../database/database.module';
import { UserDatabaseConfig } from './user.database.config';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';

@Module({
  modules: [ DatabaseModule ],
  controllers: [
    UsersController,
  ],
  components: [
    UsersService,
    { provide: TypeOrmDatabaseConfig, useClass: UserDatabaseConfig },
  ],
  exports: [ UsersService ],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer.apply(UserFindMiddleware).forRoutes({
      path: 'users/:id', method: RequestMethod.ALL,
    });
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: 'users/', method: RequestMethod.ALL,
    });
  }
}
