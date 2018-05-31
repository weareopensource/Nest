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
import { AuthGuard } from '@nestjs/passport';

// @ApiUseTags('users')
// @UseGuards(RolesGuard)
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  public async getCurrentUser(@Request() request, @Param('id') id: string) {
    return this.usersService.findOne(id);
  }

/*
  @Delete('accounts')
  public async deleteUser(@Request() request, @Param('id', new ParseIntPipe()) id) {
    return request.user;
  }

  @Post('accounts')
  public async addUser(@Request() request, @Param('id', new ParseIntPipe()) id) {
    return request.user;
  }
*/
  @Post('password')
  public async changePassword(@Request() request, @Param('id') id: string) {
    return request.user;
  }

  @Post('picture')
  public async changePicture(@Request() request, @Param('id') id: string) {
    return request.user;
  }

  @Get('')
  // @Roles('admin')
  public async getAllUsers() {
    return this.usersService.findAll();
  }
/*
  @Post()
  @UsePipes(new ValidationPipe())
  public async addUser(@Body('user') user) {
    return this.usersService.add(user);
  }
*/

  @Get(':id')
  //  @Roles('admin')
  public async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async updateUser(@Param('id') id: string, @Request() request: any, @Body() user: any) {
    return this.usersService.update(id, request.user.id, user);
  }

  @Delete(':id')
//  @Roles('admin')
  public async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

/**
 *   // Setting up the users profile api
  app.route('/api/users/me').get(passport.authenticate('jwt'), users.me);
  app.route('/api/users').put(passport.authenticate('jwt'), users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/accounts').post(users.addOAuthProviderUserProfile);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);

   app.route('/api/users').get(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.update)
    .delete(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
 */
