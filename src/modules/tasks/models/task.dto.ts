import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Task } from '../entities/task.entity';

export class TaskDto {

  @ApiModelProperty()
  @IsString()
  readonly id?: number;

  @ApiModelProperty()
  @IsString()
  readonly title?: string;

  @ApiModelProperty()
  @IsString()
  readonly description?: string;

  @ApiModelProperty()
  @IsString()
  readonly userId?: string;
}

export const toTaskDto = (taskEntity: any): TaskDto => {
  const taskDto = taskEntity.toObject({ getters: true });
  delete taskDto._id;
  delete taskDto.__v;
  delete taskDto.createdDate;
  delete taskDto.updatedDate;
  return taskDto as TaskDto;
};
