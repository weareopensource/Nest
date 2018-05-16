import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsArray } from 'class-validator';
import { Media } from '../medias';

export class CommandDto {

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
  readonly userIds?: number[];

  @ApiModelProperty()
//  @IsArray()
  readonly medias?: Media[];
}
