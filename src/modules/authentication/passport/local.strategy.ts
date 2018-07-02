import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super({
      usernameField: 'usernameOrEmail',
    });
  }

  // tslint:disable-next-line:ban-types
  public async validate(usernameOrEmail: string, password: string, done: Function): Promise<void> {

    const user = await this._authenticationService.validate(usernameOrEmail, password);
    done(false, user);
  }
}
