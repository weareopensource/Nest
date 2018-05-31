import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    ManyToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    ObjectIdColumn,
    ObjectID,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Moment } from 'moment';

@Entity()
export class Task {

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({
    select: false,
  })
  createdDate: Moment;

  @UpdateDateColumn({
    select: false,
  })
  updatedDate: Moment;

  @ObjectIdColumn()
  userId: ObjectID;
}
