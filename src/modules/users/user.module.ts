import { AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { UsersController, UsersService, UserFindMiddleware, User } from './';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService,
  ],
  exports: [ UsersService ],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserFindMiddleware).forRoutes('users/:id');
    consumer.apply(AuthenticationMiddleware).forRoutes('users/');
  }
}
