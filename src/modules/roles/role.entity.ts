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
import { User } from '../users/user.entity';

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(type => User, (user: User) => user.roles, {
//    cascadeInsert: true,
//    cascadeUpdate: true,
  })
  users: User[];

}
