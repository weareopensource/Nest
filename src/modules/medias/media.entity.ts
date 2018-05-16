import {
    Column,
    Entity,
    ManyToOne,
    ManyToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';
import { Command } from '../commands/command.entity';

@Entity()
export class Media extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    mimeType: string;

    @Column({ nullable: true })
    content: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @ManyToOne(type => Command, command => command.medias, {
      cascadeInsert: true,
      cascadeUpdate: true,
    })
    command: Command;
}
