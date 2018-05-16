import { ForbiddenException } from './../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { UserDto } from './user.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { Service } from '../common/service.interface';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiUseTags('users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  public async addUser(@Body('user') user) {
    return this.usersService.add(user);
  }

  @Get()
  public async getAllUsers() {
    return this.usersService.getAll();
  }

  @Get(':id')
  public async getUser(@Request() request, @Param('id', new ParseIntPipe()) id) {
    return request.user;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  public async replaceUser(@Request() request, @Body('user') user) {
    return this.usersService.update(request.user);
  }

  @Delete(':id')
  public async deleteUser(@Request() request, @Param('id', new ParseIntPipe()) id) {
    return this.usersService.remove(request.user);
  }
}
