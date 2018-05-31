import { AuthenticationMiddleware } from '../authentication/authentication.module';
import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { UsersController, UsersService, UserFindMiddleware, User } from './';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
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
//    consumer.apply(UserFindMiddleware).forRoutes('users/:id');
    consumer.apply(AuthenticationMiddleware).forRoutes('users/');
  }
}
