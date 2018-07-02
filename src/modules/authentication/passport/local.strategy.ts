import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  // tslint:disable-next-line:ban-types
  public async validate(email: string, password: string, done: Function): Promise<void> {

    const user = await this._authenticationService.validate(email, password);
    done(false, user);
  }
}
