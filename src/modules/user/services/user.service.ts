import { UserDto } from '../models/user.dto';
import { Injectable, Inject } from '@nestjs/common';
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
    userDoc.roles = [roleDoc._id];
    return userDoc.save().then(doc => doc.populate({ path: 'roles' }).execPopulate());
  }

  public async findOne(userId: number): Promise<any > {
    return this._userModel.findOne({ _id: userId }).populate('roles');
  }

  public async findOneByEmail(email: string): Promise < any > {
    return this._userModel.findOne({ email }).populate('roles');
  }

  public async findOneBySub(sub: string): Promise < any > {
    return this._userModel.findOne({ sub }).populate('roles');
  }

  public async update(userId: string, user: UserDto): Promise < any > {
    return this._userModel.findByIdAndUpdate(userId, user).then(() => user);
  }

  public async delete(userId: string): Promise < any > {
    await this._userModel.findByIdAndRemove(userId);
    return { userId };
  }

  public async findAll(): Promise < any > {
    return this._userModel.find().populate('roles');
  }

}
