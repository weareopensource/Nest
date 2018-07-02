import { User, UserService } from '../../user';
import { Repository } from 'typeorm';
import { Injectable, forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { hash } from 'argon2';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { verify as verifyArgon2 } from 'argon2';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
//     const publicKey = fs.readFileSync('./public.key');
//     const verify = jwt.verify(token, publicKey);

const RSA_PRIVATE_KEY = readFileSync(resolve(__dirname, '../certificates/private.key'));
const EXPIRES_IN = 24 * 60 * 60;

@Injectable()
export class AuthenticationService {
  constructor(private readonly _userService: UserService) {}

  public async validate(email: string, password: string): Promise<any> {
/*
    if (!credentials.email) {
      throw new HttpException('Email is required', 422);
    }
    if (!credentials.password) {
      throw new HttpException('Password is required', 422);
    }
*/

    const user = await this._userService.findOneByEmail(email);

    const isPasswordValid = await verifyArgon2(user.passwordDigest, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  public async register(firstName: string, lastName: string, email: string, password: string) {
    const passwordDigest = await hash(password);
    return this._userService.save({ firstName, lastName, email, passwordDigest });
  }

  public createToken(user: any) {
    return sign({ userId: user.id }, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: EXPIRES_IN,
      subject: '1',
    } as SignOptions);
  }

  async validateUser(payload: any): Promise<any> {
    return {};
  }

}
