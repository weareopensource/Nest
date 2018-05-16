import { UsersController } from '../users/users.controller';
import { AuthenticationController } from './../authentication/authentication.controller';
import { AuthenticationMiddleware } from './../authentication/authentication.middleware';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';
import { Module, RequestMethod, MiddlewaresConsumer } from '@nestjs/common';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../users/user.module';
// import * as csurf from 'csurf';
import { CommandModule } from '../commands/commands.module';
import { MediaModule } from '../medias/medias.module';

@Module({
  modules: [
    CommonModule,
    AuthenticationModule,
    CommandModule,
    MediaModule,
    UserModule,
    RoleModule,
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewaresConsumer): void {
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
