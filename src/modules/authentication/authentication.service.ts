import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { TypeOrmDatabaseService } from './../database/typeOrm.database.service';
import { Component, forwardRef, Inject } from '@nestjs/common';
import { HttpException } from '@nestjs/core';
// import { hash } from 'argon2';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { UsersService } from '../users/users.service';

//     const publicKey = fs.readFileSync('./public.key');
//     const verify = jwt.verify(token, publicKey);

const RSA_PRIVATE_KEY = readFileSync(resolve(__dirname, 'certs/private.key'));
const EXPIRES_IN = 24 * 60 * 60;

@Component()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public login(email: string, password: string): Promise<any> {
    if (!email) {
      throw new HttpException('Email is required', 422);
    }
    if (!password) {
      throw new HttpException('Password is required', 422);
    }
    return this.usersService.get(email)
    .then((user: any) => {
      const token = this.createToken(user);
      const expiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;
      return { token, user, tokenExpiresIn: expiresIn };
    });
  }

  public register(firstName: string, email: string, password: string) {
//    const passwordDigest = await hash(password);
    return this.usersService.add({ firstName, email, password });
  }

  createToken(user: any) {
    return sign({user: user.email}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: EXPIRES_IN,
      subject: '1',
    } as SignOptions);
  }

  async validateUser(signedUser): Promise<boolean> {
    // put some validation logic here
    // for example query user by id / email / username
    return true;
  }
}
