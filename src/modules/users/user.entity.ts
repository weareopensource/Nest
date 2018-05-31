import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Role } from '../roles/role.entity';
import { Moment } from 'moment';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    select: false,
    nullable: true,
  })
  passwordDigest: string;
/*
  @ManyToMany(type => Role)
  @JoinTable()
  */
  @Column({ nullable: false })
  roleIds: ObjectID[];

  @Column({ nullable: false })
  provider: string;

  @Column({ nullable: false })
  profileImageURL: string;

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
/*
  @OneToMany(type => Task, (task: Task) => task.user, {
    //      cascadeInsert: true,
    //      cascadeUpdate: true,
  })
  tasks: ObjectID[];
*/

}
