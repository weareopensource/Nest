import { AuthenticationModule, AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { MediasController, MediasService, MediaFindMiddleware, Media } from './';
import { MediaDatabaseConfig } from './media.database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Command } from '../commands';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, Command]),
  ],
  controllers: [
    MediasController,
  ],
  providers: [
    MediasService,
  ],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
//   consumer.apply(MediaFindMiddleware).forRoutes({
//      path: 'medias/:id', method: RequestMethod.ALL,
//    });
//    consumer.apply(AuthenticationMiddleware).forRoutes({
//      path: 'medias/', method: RequestMethod.ALL,
//    });
  }
}
