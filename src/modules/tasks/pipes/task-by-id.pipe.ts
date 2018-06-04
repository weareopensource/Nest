import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskByIdPipe implements PipeTransform<string, Promise<Task>> {

  constructor(private readonly _taskService: TaskService) { }

  async transform(taskId: string, metadata: ArgumentMetadata): Promise<Task> {
    const id = parseInt(taskId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('Validation failed');
    }
    return this._taskService.find(id);
  }
}
