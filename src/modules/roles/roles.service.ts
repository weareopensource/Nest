import { RoleDto } from './role.dto';
import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService implements Service<Role> {

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

  public async add(role: Role): Promise<Role> {
    return (await this.repository).save(role);
  }

  public async addAll(roles: Role[]): Promise<any[]> {
    return (await this.repository).save(roles);
  }

  public async getAll(): Promise<any> {
    return (await this.repository)
    .find({ relations: ['users'] });
  }

  public async get(id: number): Promise<any> {
    return (await this.repository)
    .findByIds([id], { relations: ['users'] })
    .then(((role: Array<Role>) => role[0]));
  }

  public async update(role: Role): Promise<Role> {
    return (await this.repository)
    .save(role)
    .then(savedRole => savedRole);
  }

  public async remove(role: Role): Promise<Role> {
    return (await this.repository)
    .remove(role);
  }
}
