import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserDto } from '../models/user.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { Service } from '../../common/service.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { AuthGuard } from '@nestjs/passport';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';

@ApiUseTags('users')
// @UseGuards(RolesGuard)
@Controller('users')
export class UserController {

  constructor(private readonly _userService: UserService) { }

  @Get('me')
  public async getCurrentUser(@Request() request, @Param('id') id: number) {
    return this._userService.findOne(id);
  }

  @Post('password')
  public async changePassword(@Request() request, @Param('id') id: number) {
    return request.user;
  }

  @Post('picture')
  public async changePicture(@Request() request, @Param('id') id: number) {
    return request.user;
  }

  @Get('')
  // @Roles('admin')
  public async getAllUsers() {
    return this._userService.findAll();
  }

  @Get(':id')
  //  @Roles('admin')
  public async getUser(@Param('id') id: number) {
    return this._userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async updateUser(@Param('id') userDoc: User, @Request() request: any, @Body() userDto: UserDto) {
    return this._userService.update(userDoc, userDto);
  }

  @Delete(':id')
//  @Roles('admin')
  public async deleteUser(@Param('id') id: number) {
    return this._userService.delete(id);
  }
}
