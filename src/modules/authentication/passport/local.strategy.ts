import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  // tslint:disable-next-line:ban-types
  public async validate(email: string, password: string, done: Function) {

    const user = await this.usersService.findOneByEmail(email).catch(console.log);
    const isPasswordValid = await verify(user.passwordDigest, password);
    if (!isPasswordValid) {
      return done(new UnauthorizedException(), false);
    }
    done(false, user);
  }
}
