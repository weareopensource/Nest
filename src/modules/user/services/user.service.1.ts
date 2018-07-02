import { UserDto } from '../models/user.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Service } from '../../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../interfaces/user.interface';
import { Role } from '../interfaces/role.interface';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
//    @InjectRepository(User)
//    private readonly _userRepository: Repository<User>,
//    @InjectRepository(Role)
//    private readonly _roleRepository: Repository<Role>,
    @InjectModel('user')
    private readonly _userModel: Model<any>,
    @InjectModel('role')
    private readonly _roleModel: Model<any>,
  ) { }

  private async _seed() {
//    const count = await this._userModel.count();
//    if (count === 0) {
//      return (await this.usersRepository).save([{ role: 'admin' }, { name: 'user' }]);
//    }
  }

  public async save(user: any): Promise< any> {
    const userDoc = new (this._userModel)(user);
    const roleDoc = await this._roleModel.findOne({ name: 'user' });
    userDoc.roles = [roleDoc.id];
    return userDoc.save()
    .then(({ id, firstName, lastName, email, roles, profileImageURL }) => ({ id, firstName, lastName, email, roles, profileImageURL }));
  }

  public async findOne(userId: number): Promise<any > {
    return this._userModel.findOne({ id: userId });
  }

  public async findOneByEmail(email: string): Promise < any > {
    return this._userModel.findOne({ email }).populate('roles');
  }

  public async findOneBySub(sub: string): Promise < any > {
    return this._userModel.findOne({ sub }).populate('roles');
  }

  public async update(userEntity: User, userDto: UserDto): Promise < any > {
    Object.assign(userEntity, userDto);
    return;
    // return userEntity.save();
  }

  public async delete(id: number): Promise < any > {
    return this._userModel.remove({ id });
  }

  public async findAll(): Promise < any > {
    return this._userModel.find().populate('roles');
  }

}
