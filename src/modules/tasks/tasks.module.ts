import { Module } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../user';
// import { TaskByIdPipe } from './pipes/task-by-id.pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schemas/task.schema';

@Module({
  imports: [
//    TypeOrmModule.forFeature([Task]),
    MongooseModule.forFeature([
      { name: 'task', schema: taskSchema },
    ]),
  ],
  controllers: [
    TaskController,
  ],
  providers: [
    TaskService,
//    TaskByIdPipe,
  ],
})
export class TaskModule { }
