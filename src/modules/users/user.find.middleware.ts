import { UserDto } from './user.dto';
import { Middleware, NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Injectable()
export class UserFindMiddleware implements NestMiddleware {

  constructor(private readonly usersService: UsersService) { }

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
