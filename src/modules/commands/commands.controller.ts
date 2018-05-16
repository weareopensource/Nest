import { ForbiddenException } from './../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { CommandDto } from './command.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, Patch } from '@nestjs/common';
import { Service } from '../common/service.interface';
import { Command } from './command.entity';
import { CommandsService } from './commands.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiUseTags('commands')
@Controller('commands')
//@UseGuards(RolesGuard)
export class CommandsController {

  constructor(private readonly commandsService: CommandsService) { }

  @Post()
//  @Roles('admin')
//  @UsePipes(new ValidationPipe())
  public async addCommand(@Body() createCommandDto: CommandDto) {
    console.log('sqsdqsdqdsfdkfglj', createCommandDto);
    return this.commandsService.add(createCommandDto);
  }

  @Get()
  public async getAllCommands(): Promise<CommandDto[]> {
    return this.commandsService.getAll();
  }

  @Get(':id')
  public async getCommand(@Request() request, @Param('id', new ParseIntPipe()) id): Promise<CommandDto> {
    return request.command;
  }

  @Put(':id')
//  @UsePipes(new ValidationPipe())
  public async replaceCommand(@Request() request, @Body() command) {
    return this.commandsService.update(command.id, command);
  }

  @Patch(':id')
//  @UsePipes(new ValidationPipe())
  public async updateCommand(@Request() request, @Body('id', new ParseIntPipe()) commandId, @Body('changes') changes) {
    return this.commandsService.update(commandId, changes);
  }

  @Delete(':id')
  public async deleteCommand(@Request() request, @Param('id', new ParseIntPipe()) commandId) {
    return this.commandsService.remove(commandId);
  }
}
