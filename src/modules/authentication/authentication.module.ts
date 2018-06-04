// import * as csurf from 'csurf';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { MsalStrategy } from './passport/msal.strategy';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [ UserModule ],
  controllers: [ AuthenticationController ],
  providers: [
    AuthenticationService,
    JwtStrategy,
    LocalStrategy,
    MsalStrategy,
  ],
})
export class AuthenticationModule { }
