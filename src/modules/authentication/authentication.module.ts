import { AuthenticationMiddleware } from './authentication.middleware';
export  { AuthenticationMiddleware };
import { JwtStrategy } from './passport/jwt.strategy';
import * as passport from 'passport';
// import * as csurf from 'csurf';
import { AuthenticationDatabaseConfig } from './authentication.database.config';
import { Module, MiddlewareConsumer, RequestMethod, NestMiddleware, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [ UserModule ],
  controllers: [ AuthenticationController ],
  providers: [
    AuthenticationService,
    JwtStrategy,
  ],
})
export class AuthenticationModule implements NestModule {

  public configure(consumer: MiddlewareConsumer) {
 //   consumer
//      .apply(passport.authenticate('jwt', { session: false }))
//      .forRoutes({ path: '/auth/authorized', method: RequestMethod.ALL });

  }
}
