import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';
import { User } from '../interfaces/user.interface';
import { Model } from 'mongoose';

export class UserDto {
  @ApiModelProperty()
  @IsInt()
  readonly id?: string;

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

export const toUserDto = (user: any) => {
  const userDto: any = user.toObject({ getters: true });
  delete userDto.passwordDigest;
  delete userDto._id;
  delete userDto.__v;
  userDto.roles = userDto.roles.map(role => role.name);
  return userDto;
};
