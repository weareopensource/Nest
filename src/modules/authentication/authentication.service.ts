import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { hash } from 'argon2';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { verify as verifyArgon2 } from 'argon2';
import { LoginDto } from './login.dto';
//     const publicKey = fs.readFileSync('./public.key');
//     const verify = jwt.verify(token, publicKey);

const RSA_PRIVATE_KEY = readFileSync(resolve(__dirname, 'passport/certs/private.key'));
const EXPIRES_IN = 24 * 60 * 60;

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async login(credentials: LoginDto): Promise<any> {
    if (!credentials.email) {
      throw new HttpException('Email is required', 422);
    }
    if (!credentials.password) {
      throw new HttpException('Password is required', 422);
    }

    const user = await this.usersService.findOneByEmail(credentials.email);

    const isPasswordValid = await verifyArgon2(user.passwordDigest, credentials.password);

    if (!isPasswordValid) {
      throw new HttpException('Password is invalid', 422);
    }

    delete user.passwordDigest;

    return user;
  }

  public async register({ firstName, lastName, email, password }: any) {
    const passwordDigest = await hash(password);
    return this.usersService.insert({ firstName, lastName, email, passwordDigest });
  }

  public createToken(user: any) {
    return sign({ userId: user.id }, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: EXPIRES_IN,
      subject: '1',
    } as SignOptions);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return {};
  }

}
