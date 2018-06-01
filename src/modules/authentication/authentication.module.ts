// import * as csurf from 'csurf';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../users/user.module';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { MsalStrategy } from './passport/msal.strategy';

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
