import { ForbiddenException } from './../common/exceptions/forbidden.exception';
import { verify } from 'jsonwebtoken';
import { UserDto } from '../users/user.dto';
import { Request, Response, NextFunction } from 'express';
import { Middleware, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { UsersService } from '..//users/users.service';
import { Service } from '../common/service.interface';
import { User } from '../users/user.entity';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const RSA_PUBLIC_KEY = readFileSync(resolve(__dirname, 'passport/certs/public.key'));

export const AuthenticationMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.TOKEN;
    if (!token) {
      throw new Error('no token');
    }
    verify(token, RSA_PUBLIC_KEY);
    req.userId = token.sub;
    next();
  }
  catch (e) {
    throw new ForbiddenException(e.message);
  }
};
