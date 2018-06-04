import { UserDto } from '../models/user.dto';
import { Middleware, NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserFindMiddleware implements NestMiddleware {

  constructor(private readonly _userService: UserService) { }

  resolve() {
    return async (req, res, next) => {
      if (!req.params.id) {
        throw new HttpException({ error: 'Oops, something went wrong.' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

//      const user = await this.usersService.get(req.params.id);
//      if (!user) {
//        throw new HttpException('User not found.', 404);
//      }
//      req.user = user;
      next();
    };
  }
}
