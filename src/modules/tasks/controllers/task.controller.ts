import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Roles } from '../../common/decorators/roles.decorator';
import { TaskDto } from '../models/task.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, Patch, HttpException } from '@nestjs/common';
import { Service } from '../../common/service.interface';
import { Task } from '../entities/task.entity';
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
//  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  public async addTask(@Request() request: any, @Body() task: TaskDto) {
    return this._taskService.insert(task, request.user.id);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public async getUserTasks(@Request() request): Promise<TaskDto[]> {
    return this._taskService.find(request.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async getTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request): Promise<TaskDto> {
    if (taskEntity.userId === request.user.id) {
      return taskEntity as any;
    } else {
      throw new HttpException('404', 404);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public async deleteTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request): Promise<TaskDto> {
    if (taskEntity.userId === request.user.id) {
      return this._taskService.delete(taskEntity.id);
    } else {
      throw new HttpException('404', 404);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
//  @UsePipes(new ValidationPipe())
  public async replaceTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request, @Body() taskDto: TaskDto) {
    if (taskEntity.userId === request.user.id) {
      return this._taskService.update(taskDto);
    } else {
      throw new HttpException('404', 404);
    }
  }

  @Patch(':id')
//  @UsePipes(new ValidationPipe())
  public async updateTask(@Param('id', TaskByIdPipe) taskEntity: Task, @Request() request, @Body('id') id: number, @Body('changes') changes: any) {
    if (taskEntity.userId === request.user.id) {
      return this._taskService.update(changes);
    } else {
      throw new HttpException('404', 404);
    }
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
