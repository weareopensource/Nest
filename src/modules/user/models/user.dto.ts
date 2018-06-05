import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';
import { User } from '../interfaces/user.interface';

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

export const toUserDto = (user: User) => {
  const userDto: any = { ...user };
  delete userDto.passwordDigest;
  delete userDto.roles;
  userDto.roles = user.roles.map(role => role.name);
  return userDto;
};
