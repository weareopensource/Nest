import { RoleDto } from './role.dto';
import { Component } from '@nestjs/common';
import { TypeOrmDatabaseService } from '../database/typeOrm.database.service';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';

function roleDto(role: Role): RoleDto {
  const userIds = role.users.map(user => user.id);
  delete role.users;
  return { ...role, userIds } as RoleDto;
}

@Component()
export class RolesService implements Service<RoleDto> {

  constructor(private databaseService: TypeOrmDatabaseService) { }

  private get repository(): Promise<Repository<Role>> {
    return this.databaseService.getRepository(Role);
  }

  private async seed() {
    const rolesRepository = await this.repository;
    const count = await rolesRepository.count();
    if (count === 0) {
//            const roles = await rolesRepository.save([new Role('John Doe', 30), new Role('Jane Doe', 40)]);
            console.log('Seeded Roles.');
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
    .findOneById(id, { relations: ['users'] })
    .then(role => roleDto(role));
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
