import { UserDto } from '../models/user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Service } from '../../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) { }

  private async _seed() {
    const count = await (await this._userRepository).count();
    if (count === 0) {
//      return (await this.usersRepository).save([{ role: 'admin' }, { name: 'user' }]);
    }
  }

  public async save(user: any): Promise<any> {
    const userEntity = await (await this._userRepository).create();
    Object.assign(userEntity, user);
    const roleEntity = await (await this._roleRepository).findOneOrFail({ name: 'user' });
    userEntity.roles = [roleEntity];

    return (await this._userRepository)
    .save(userEntity)
    .then(({ id, firstName, lastName, email, roles, profileImageURL }) => ({ id, firstName, lastName, email, roles, profileImageURL }));
  }

  public async findOne(userId: number): Promise<any> {
    return (await this._userRepository).findOneOrFail({ id: userId });
  }

  public async findOneByEmail(email: string): Promise<any> {
//    return (await this._userRepository).findOneOrFail({ email }, {relations: ['roles']});

    return (await this._userRepository)
    .createQueryBuilder('user')
    .select()
    .addSelect('user.passwordDigest')
    .leftJoinAndSelect('user.roles', 'role')
    .where('user.email = :email', { email })
    .getOne();
  }

  public async findOneBySub(sub: string): Promise<any> {
    return await (await this._userRepository).findOneOrFail({ sub });
  }

  public async update(userEntity: User, userDto: UserDto): Promise<any> {
    Object.assign(userEntity, userDto);
    return (await this._userRepository).save(userEntity);
  }

  public async delete(id: number): Promise<any> {
    return (await this._userRepository).delete({ id });
  }

  public async findAll(): Promise<any> {
    return (await this._userRepository).find();
  }

}
