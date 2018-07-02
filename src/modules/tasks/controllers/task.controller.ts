import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Roles } from '../../common/decorators/roles.decorator';
import { TaskDto, toTaskDto } from '../models/task.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, Patch, HttpException } from '@nestjs/common';
import { Service } from '../../common/service.interface';
import { Task } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { TaskByIdPipe } from '../pipes/task-by-id.pipe';

@ApiUseTags('tasks')
@Controller('tasks')
// @UseGuards(RolesGuard)
export class TaskController {

  constructor(private readonly _taskService: TaskService) { }

  @Post()
//  @Roles('admin')
  @UseGuards(AuthGuard('jwt'))
  public async addTask(@Request() request: any, @Body() task: any) {
    return toTaskDto(await this._taskService.insert(task, request.user.id));
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public async getUserTasks(@Request() request): Promise<Array<any>> {
    return (await this._taskService.find(request.user.id)).map(toTaskDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public getTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request): TaskDto {
    if (taskEntity.user.toString() === request.user.id) {
      return toTaskDto(taskEntity);
    } else {
      throw new HttpException('404', 404);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public async deleteTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request): Promise<any> {
    if (taskEntity.user.toString() === request.user.id) {
      return this._taskService.delete(taskEntity.id);
    } else {
      throw new HttpException('401', 401);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async updateTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request, @Body() taskDto: any): Promise<any> {
    if ((taskEntity.id === taskDto.id) && (taskEntity.user.toString() === request.user.id)) {
      return this._taskService.update(taskEntity.id, taskDto);
    }
    throw new HttpException('401', 401);
  }
}

/*

  // Tasks collection routes
  app.route('/api/tasks').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.list)
    .post(tasks.create);

app.route('/api/tasks/me').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.userList);

  // Single task routes
  app.route('/api/tasks/:taskId').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(tasks.update)
    .delete(tasks.delete);

  // Finish by binding the task middleware
  app.param('taskId', tasks.taskByID);
};

*/
