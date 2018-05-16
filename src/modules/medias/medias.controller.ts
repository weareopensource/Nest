import { ForbiddenException } from './../common/exceptions/forbidden.exception';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { MediaDto } from './media.dto';
import { Response } from 'express';
import { Controller, Get, Post, Request, Param, Body, Put, Delete, UseGuards, UsePipes, Patch, Query } from '@nestjs/common';
import { Service } from '../common/service.interface';
import { Media } from './media.entity';
import { MediasService } from './medias.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiUseTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiUseTags('medias')
@Controller('medias')
//@UseGuards(RolesGuard)
export class MediasController {

  constructor(private readonly mediasService: MediasService) { }

  @Post('create')
//  @Roles('admin')
//  @UsePipes(new ValidationPipe())
  public async addAllMedias(@Body('medias') medias: MediaDto[]) {
    return this.mediasService.addAll(medias);
  }

  @Post('delete')
//  @Roles('admin')
//  @UsePipes(new ValidationPipe())
  public async deleteAllMedias(@Body('mediaIds') mediaIds) {
    return this.mediasService.deleteAll(mediaIds);
  }

  @Get()
  public async getAllMedias() {
    return this.mediasService.getAll();
  }

  @Patch(':id')
//  @UsePipes(new ValidationPipe())
  public async updateMedia(@Request() request, @Param('id', new ParseIntPipe()) mediaId, @Body() media: MediaDto) {
    return this.mediasService.update(request.media);
  }

  @Delete(':id')
  public async deleteMedia(@Request() request, @Param('id', new ParseIntPipe()) mediaId) {
    return this.mediasService.remove(mediaId);
  }
}
