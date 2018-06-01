import { TaskDto } from './task.dto';
import { Middleware, NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Injectable()
export class TaskFindMiddleware implements NestMiddleware {

  constructor(private tasksService: TasksService) { }

  resolve() {
    return async (req, res, next) => {/*
      if (!req.params.id) {
        throw new HttpException({ error: 'Oops, something went wrong.' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const task = await this.tasksService.get(req.params.id);
      if (!task) {
        throw new HttpException('Task not found.', 404);
      }
      req.task = task;*/
      next();
    };
  }
}
