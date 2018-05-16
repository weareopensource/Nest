import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';

export class UserDto {
  @ApiModelProperty()
  @IsInt()
  readonly id?: number;

  @ApiModelProperty()
  @IsString()
  readonly firstName?: string;

  @ApiModelProperty()
  @IsString()
  readonly lastName?: string;

  @ApiModelProperty()
  @IsString()
  readonly email?: string;

  @ApiModelProperty()
  @IsArray()
  readonly roles?: string[];
}
