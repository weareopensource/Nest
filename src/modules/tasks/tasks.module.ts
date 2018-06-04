import { Module } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user';
import { TaskByIdPipe } from './pipes/task-by-id.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [
    TaskController,
  ],
  providers: [
    TaskService,
    TaskByIdPipe,
  ],
})
export class TaskModule { }
