import { AuthenticationModule, AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewaresConsumer, OnModuleInit } from '@nestjs/common';
import { MediasController, MediasService, MediaFindMiddleware } from './';
import { DatabaseModule } from '../database/database.module';
import { MediaDatabaseConfig } from './media.database.config';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';

@Module({
  modules: [ DatabaseModule ],
  controllers: [
    MediasController,
  ],
  components: [
    MediasService,
    { provide: TypeOrmDatabaseConfig, useClass: MediaDatabaseConfig },
  ],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
//   consumer.apply(MediaFindMiddleware).forRoutes({
//      path: 'medias/:id', method: RequestMethod.ALL,
//    });
//    consumer.apply(AuthenticationMiddleware).forRoutes({
//      path: 'medias/', method: RequestMethod.ALL,
//    });
  }
}
