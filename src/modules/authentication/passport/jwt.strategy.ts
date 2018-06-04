import { Strategy } from 'passport-jwt';
import { UserService } from '../../user';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _userService: UserService) {
    super({
      jwtFromRequest: (req) => req && req.cookies && req.cookies.TOKEN,
      secretOrKey: readFileSync(resolve(__dirname, '../certificates/public.key')),
});
  }

  // tslint:disable-next-line:ban-types
  public async validate(token: any, done: Function) {
    const user = await this._userService.findOne(token.userId).catch(console.error);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(false, user);
  }
}
