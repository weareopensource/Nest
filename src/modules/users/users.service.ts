import { UserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  public async insert(user: any): Promise<any> {
    const defaultRole = await (await this.roleRepository).findOne({ name: 'user' });
    const newUser = { ...user, roleIds: [ defaultRole.id ], provider: 'local', profileImageURL: '/assets/ic_profile.png' };
    return this.userRepository.insert(newUser)
    .then(async (result: any) => {
      delete newUser.passwordDigest;
      return {...newUser, role: 'user', id: result.identifiers[0].id };
    });

  }

  public async findOne(id: string): Promise<any> {
    const user = await (await this.userRepository).findOne({ _id: new ObjectId(id) } as any);
    const userRoles = await (await this.roleRepository).findByIds(user.roleIds);
    delete user.passwordDigest;
    delete user.roleIds;
    return { ...user, roles: userRoles.map(role => role.name) };
  }

  public async findOneByEmail(email: string): Promise<any> {
    const user = await (await this.userRepository).findOne({ email });
    const userRoles = await (await this.roleRepository).findByIds(user.roleIds);
    delete user.roleIds;
    return { ...user, roles: userRoles.map(role => role.name) };
  }

  public async update(id: string, userId: string, update: any): Promise<any> {
    const newRolesP = update.roles.map(async role => (await this.roleRepository).findOne({ name: role } as any));
    const newRoleIds = (await Promise.all(newRolesP)).map((role: any) => role.id);
    const user = await (await this.userRepository).findOneOrFail({ _id: new ObjectId(id) } as any).catch(console.log);
    (user as any).roleIds =  newRoleIds;
    (user as any).profileImageURL =  update.profileImageURL;
    (user as any).firstName =  update.firstName;
    (user as any).lastName =  update.lastName;
    (user as any).email =  update.email;
    return (await this.userRepository).save((user as any)).then(() => { (user as any).roles = update.roles; return user; });
  }

  public async delete(id: string): Promise<any> {
    return (await this.userRepository).delete({ _id: new ObjectId(id) } as any).then(() => ({ id }));
  }

  public async findAll(): Promise<any> {
    const users = await (await this.userRepository).find();
    const usersP = users.map(async (user: any) => {
      delete user.passwordDigest;
      const userRolesP = user.roleIds.map(async (roleId) => (await (await this.roleRepository).findOne({ _id: new ObjectId(roleId) } as any)).name);
      const userRoles = await Promise.all(userRolesP);
      delete user.roleIds;
      return { ...user, roles: userRoles };
    });
    return await Promise.all(usersP);
  }

}
