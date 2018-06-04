import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsArray } from 'class-validator';
import { Task } from '../entities/task.entity';

export class TaskDto {

  @ApiModelProperty()
  @IsInt()
  readonly id: number;

  @ApiModelProperty()
  @IsString()
  readonly title: string;

  @ApiModelProperty()
  @IsString()
  readonly description: string;

  @ApiModelProperty()
  @IsInt()
  readonly userId?: number;
}

export const toTaskDto = (taskEntity: Task): TaskDto => {
  const taskDto = { ...taskEntity } as TaskDto;
  return taskDto;
};
