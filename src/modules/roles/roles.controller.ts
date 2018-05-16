import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleDto } from './role.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiUseTags('roles')
@Controller('roles')
@UseGuards(RolesGuard)
export class RolesController {

  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  public async addDentist(@Body('role') role: RoleDto) {
    return this.rolesService.add(role);
  }

  @Get()
  public async getAllRoles() {
    return this.rolesService.getAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  public async replaceRole(@Request() request, @Body('role') role: RoleDto) {
    return this.rolesService.update(request.role);
  }

  @Delete(':id')
  public async deleteRole(@Request() request, @Param('id', new ParseIntPipe()) id) {
    return this.rolesService.remove(request.role);
    }
}
