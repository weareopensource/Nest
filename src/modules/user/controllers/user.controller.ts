import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserDto, toUserDto } from '../models/user.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, HttpException } from '@nestjs/common';
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
  @UseGuards(AuthGuard('jwt'))
  public async getCurrentUser(@Request() request) {
    return { user: request.user };
  }

  @Post('password')
  @UseGuards(AuthGuard('jwt'))
  public async changePassword(@Request() request, @Param('id') id: number) {
    return request.user;
  }

  @Post('picture')
  @UseGuards(AuthGuard('jwt'))
  public async changePicture(@Request() request, @Param('id') id: number) {
    return request.user;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  // @Roles('admin')
  public async getAllUsers() {
    return this._userService.findAll().then(users => users.map(user => toUserDto(user)));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  //  @Roles('admin')
  public async getUser(@Param('id') id: number) {
    return this._userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async updateUser(@Param('id', UserByIdPipe) userDoc: User, @Request() request: any, @Body() userDto: any) {
    if ((userDoc.id === userDto.id) && (userDoc.id.toString() === request.user.id)) {
      return this._userService.update(userDoc.id, userDto);
    }
    throw new HttpException('401', 401);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
//  @Roles('admin')
  public async deleteUser(@Param('id') userId: string) {
    return this._userService.delete(userId);
  }
}
