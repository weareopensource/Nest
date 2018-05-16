import { RoleDto } from './role.dto';
import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';

function roleDto(role: Role): RoleDto {
  const userIds = role.users.map(user => user.id);
  delete role.users;
  return { ...role, userIds } as RoleDto;
}

@Injectable()
export class RolesService implements Service<RoleDto> {

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) { }

  private async seed() {
    const rolesRepository = await this.repository;
    const count = await rolesRepository.count();
    if (count === 0) {
//            const roles = await rolesRepository.save([new Role('John Doe', 30), new Role('Jane Doe', 40)]);
      // console.log('Seeded Roles.');
//            console.log(roles);
    }
  }

  public async add(role: RoleDto): Promise<RoleDto> {
    return (await this.repository).save(role);
  }

  public async addAll(roles: RoleDto[]): Promise<any[]> {
    return (await this.repository).save(roles);
  }

  public async getAll(): Promise<any> {
    return (await this.repository)
    .find({ relations: ['users'] })
    .then(roles => ({ roles: roles.map(role => roleDto(role)) }));
  }

  public async get(id: number): Promise<any> {
    return (await this.repository)
    .findByIds([id], { relations: ['users'] })
    .then(((role: Array<Role>) => roleDto(role[0])));
  }

  public async update(role: Role): Promise<RoleDto> {
    return (await this.repository)
    .save(role)
    .then(savedRole => roleDto(savedRole));
  }

  public async remove(role: Role): Promise<RoleDto> {
    return (await this.repository)
    .remove(role)
    .then(removedRole => roleDto(removedRole));
  }
}
