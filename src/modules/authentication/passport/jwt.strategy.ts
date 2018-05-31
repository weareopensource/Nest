import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req) => req && req.cookies && req.cookies.TOKEN,
      secretOrKey: readFileSync(resolve(__dirname, 'certs/public.key')),
});
  }

  // tslint:disable-next-line:ban-types
  public async validate(token: any, done: Function) {
    const user = await this.usersService.findOne(token.userId).catch(console.error);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(false, user);
  }
}
