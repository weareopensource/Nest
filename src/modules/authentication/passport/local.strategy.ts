import { Strategy } from 'passport-local';
import { UserService } from '../../user';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  // tslint:disable-next-line:ban-types
  public async validate(email: string, password: string, done: Function): Promise<void> {
    // onsole.log('sdfsdfsdfsdf');
    const user = await this._userService.findOneByEmail(email);
    const isPasswordValid = await verify(user.passwordDigest, password);
    if (!isPasswordValid) {
      done(new UnauthorizedException('Invalid password'), false);
    } else {
      done(false, user);
    }
  }
}
