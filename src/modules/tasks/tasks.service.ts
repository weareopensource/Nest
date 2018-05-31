import { TaskDto } from './task.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users';
import { ObjectId } from 'mongodb';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) { }

  private async seed() {
//    const count = (await this.tasksRepository).count();
//    if (count === 0) {
//            const tasks = await tasksRepository.save([new Task('John Doe', 30), new Task('Jane Doe', 40)]);
            // console.log('Seeded Tasks.');
//            console.log(tasks);
//    }
  }

  public async insert(task: any, userId: string): Promise<any> {
    return (await this.tasksRepository).insert({ ...task, userId })
    .then(result => ({...task, id: result.identifiers[0].id}));
  }

  public async findOne(id: string, userId: string): Promise<any> {
    return(await this.tasksRepository)
    .findOneOrFail({ _id: new ObjectId(id), userId: new ObjectId(userId) } as any);
  }

  public async update(id: string, userId: string, update: any): Promise<any> {
    let task = await (await this.tasksRepository).findOneOrFail({ _id: new ObjectId(id), userId: new ObjectId(userId) } as any);
    task = { ...task, ...update };
    return (await this.tasksRepository)
    .save(task);
  }

  public async delete(id: string, userId: string): Promise<any> {
    /*
    return (await this.tasksRepository)
    .createQueryBuilder()
    .delete()
    .from(Task)
    .where('task._id = :id', { id: new ObjectId(id) })
    .where('task.userId = :userId', { userId: new ObjectId(userId) })
    .execute();
    */
    return (await this.tasksRepository)
    .findOne({ _id: new ObjectId(id) , userId: new ObjectId(userId) } as any)
    .then(async (task: any) => (await this.tasksRepository).remove(task))
    .then(() => ({ taskId: id }));
  }

  public async find(id: string): Promise<any> {
    return (await this.tasksRepository)
    .find({ userId: new ObjectId(id) })
    .then(tasks => ({ tasks }));
  }
}
