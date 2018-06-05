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
} from 'typeorm';
import { User } from '../../user';
import { Moment } from 'moment';

@Entity()
export class Task {

  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  userId: string;
}
