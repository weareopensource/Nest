import { AuthenticationMiddleware } from './authentication.middleware';
export  { AuthenticationMiddleware };
import { JwtStrategy } from './passport/jwt.strategy';
import * as passport from 'passport';
// import * as csurf from 'csurf';
import { AuthenticationDatabaseConfig } from './authentication.database.config';
import { DatabaseModule } from '../database/database.module';
import { Module, MiddlewaresConsumer, RequestMethod, NestMiddleware, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../users/user.module';

@Module({
  modules: [ UserModule ],
  controllers: [ AuthenticationController ],
  components: [
    AuthenticationService,
    JwtStrategy,
  ],
})
export class AuthenticationModule implements NestModule {

  public configure(consumer: MiddlewaresConsumer) {
 //   consumer
//      .apply(passport.authenticate('jwt', { session: false }))
//      .forRoutes({ path: '/auth/authorized', method: RequestMethod.ALL });

  }
}
