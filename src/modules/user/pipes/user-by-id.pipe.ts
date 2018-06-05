import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {

  constructor(private readonly _userService: UserService) { }

  async transform(userId: string, metadata: ArgumentMetadata): Promise<User> {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('Validation failed');
    }
    return this._userService.findOne(id);
  }
}
