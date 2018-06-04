import { TaskDto } from '../models/task.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { Service } from '../../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task)
    private readonly _taskRepository: Repository<Task>,
  ) { }

  public async insert(task: TaskDto, userId: number): Promise<any> {
    const taskEntity = (await this._taskRepository).create();
    Object.assign(taskEntity, task);
    taskEntity.userId = userId;
    return (await this._taskRepository).save(taskEntity);
  }

  public async findOne(taskId: number): Promise<any> {
    return (await this._taskRepository).findOneOrFail({ id: taskId });
  }

  public async update(update: any): Promise<any> {
    return (await this._taskRepository).save(update);
  }

  public async delete(taskId: number): Promise<any> {
    return (await this._taskRepository).delete({ id: taskId } );
  }

  public async find(userId: number): Promise<any> {
    return (await this._taskRepository).find({ userId });
  }
}
