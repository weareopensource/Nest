import { TaskDto } from '../models/task.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { Service } from '../../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task)
    private readonly _taskRepository: Repository<Task>,
    @InjectModel('task')
    private readonly _taskModel: Model<any>,
  ) { }

  public async insert(task: TaskDto, userId: string): Promise<any> {
    const taskDoc = new (this._taskModel)(task);
    taskDoc.user = new ObjectId(userId);
    return taskDoc.save();
  }

  public async findOne(taskId: string): Promise<any> {
    return (await this._taskModel).findOne({ _id: new ObjectId(taskId) });
  }

  public async update(task: any): Promise<any> {
    return (await this._taskModel).findByIdAndUpdate(task.id, task);
  }

  public async delete(taskId: string): Promise<any> {
    return (await this._taskModel).findByIdAndRemove(taskId);
  }

  public async find(userId: string): Promise<any> {
    return (await this._taskModel).find({ user: userId });
  }
}
