import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsArray } from 'class-validator';

export class TaskDto {

  @ApiModelProperty()
//  @IsInt()
  readonly id?: number;

  @ApiModelProperty()
  @IsString()
  readonly title?: string;

  @ApiModelProperty()
//  @IsString()
  readonly description?: string;

  @ApiModelProperty()
//  @IsArray()
  readonly userId?: string;
}
