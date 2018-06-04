import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../../user';
import { Moment } from 'moment';

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @CreateDateColumn({
    select: false,
    nullable: true,
  })
  createdDate: Moment;

  @UpdateDateColumn({
    select: false,
    nullable: true,
  })
  updatedDate: Moment;

  @ManyToMany(type => User, user => user.roles)
  users: User[];

}
