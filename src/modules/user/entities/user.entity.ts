import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { Task } from '../../tasks';
import { Role } from './role.entity';
import { Moment } from 'moment';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sub: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    name: 'password_digest',
    select: false,
    nullable: true,
  })
  passwordDigest: string;

  @ManyToMany(type => Role, role => role.users, {
    cascade: false,
  })
  @JoinTable()
  roles: Role[];

  @Column({ nullable: true })
  provider: string = 'local';

  @Column({ nullable: true })
  profileImageURL: string = '/assets/ic_profile.png';

  @CreateDateColumn({
    name: 'created_date',
    select: false,
  })
  createdDate: Moment;

  @UpdateDateColumn({
    name: 'updated_date',
    select: false,
  })
  updatedDate: Moment;

}
