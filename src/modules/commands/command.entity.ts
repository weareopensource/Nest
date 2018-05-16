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
import { Media } from '../medias/media.entity';
import { User } from '../users/user.entity';

@Entity()
export class Command {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @ManyToOne(type => User, (user: User) => user.commands, {
//      cascadeInsert: true,
//      cascadeUpdate: true,
    })
    user: User;

    @OneToMany(type => Media, (media: Media) => media.command, {
//      cascadeInsert: true,
//      cascadeUpdate: true,
    })
    medias: Media[];
}
