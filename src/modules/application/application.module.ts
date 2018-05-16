import { UsersController } from '../users/users.controller';
import { AuthenticationController } from './../authentication/authentication.controller';
import { AuthenticationMiddleware } from './../authentication/authentication.middleware';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../users/user.module';
// import * as csurf from 'csurf';
import { CommandModule } from '../commands/commands.module';
import { MediaModule } from '../medias/medias.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'command',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: true,
    }),
    CommonModule,
    UserModule,
//    RoleModule,
//    AuthenticationModule,
//    CommandModule,
//    MediaModule,
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer): void {
//    consumer
//    .apply(csurf({ cookie: { key: 'XSRF-TOKEN' }, ignoreMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'] }))
//    .forRoutes(AuthenticationController);

    consumer
    .apply([
      AuthenticationMiddleware,
//      csurf({ cookie: { key: 'XSRF-TOKEN'} }),
    ])
    .forRoutes(
      UsersController,
    );
  }
}
