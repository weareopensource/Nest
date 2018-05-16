import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  DiscriminatorColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Command } from '../commands/command.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(type => Role, role => role.users, {
    cascadeInsert: true,
    cascadeUpdate: true,
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(type => Command, command => command.user, {
    cascadeInsert: true,
    cascadeUpdate: true,
  })
  commands: Command[];
}
