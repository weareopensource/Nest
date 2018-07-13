import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {

  constructor(private readonly _userService: UserService) { }

  async transform(userId: string, _metadata: ArgumentMetadata): Promise<User> {
    return this._userService.findOne(userId);
  }
}
