import { ForbiddenException } from './../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { TaskDto } from './task.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, Patch, HttpException } from '@nestjs/common';
import { Service } from '../common/service.interface';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';

@ApiUseTags('tasks')
@Controller('tasks')
// @UseGuards(RolesGuard)
export class TasksController {

  constructor(private readonly tasksService: TasksService) { }

  @Post()
//  @Roles('admin')
//  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  public async addTask(@Request() request: any, @Body() task: TaskDto) {
    return this.tasksService.insert(task, request.user.id);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public async getUserTasks(@Request() request): Promise<TaskDto[]> {
    return this.tasksService.find(request.user.id)
    .catch(() => {
      throw new HttpException('Not Found', 404);
     });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async getTask(@Request() request, @Param('id') id: string): Promise<TaskDto> {
    return this.tasksService
    .findOne(id, request.user.id)
    .catch(() => {
      throw new HttpException('Not Found', 404);
     });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public async deleteTask(@Request() request, @Param('id') id: string): Promise<TaskDto> {
    return this.tasksService.delete(id, request.user.id).catch(() => {
      throw new HttpException('test', 500);
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
//  @UsePipes(new ValidationPipe())
  public async replaceTask(@Param('id') id: string, @Request() request, @Body() task) {
    return this.tasksService.update(id, request.user.id, task).then(() => task);
  }

  @Patch(':id')
//  @UsePipes(new ValidationPipe())
  public async updateTask(@Request() request, @Body('id') id: string, @Body('changes') changes: any) {
    return this.tasksService.update(id, changes, null);
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
