import { EventSubscriber, InsertEvent, EntitySubscriberInterface, Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
//    event.entity.roles = [await (await this._roleRepository).findOne({name: 'user'})];
//    event.entity.provider = 'local';
//    event.entity.profileImageURL = '/assets/ic_profile.png';
//    (await this._userRepository)
//    event.entity.roles = [{id: 2}];
//    console.log(`BEFORE POST INSERTED: `, event.entity);
  }
}
