import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';

export class RegisterDto {

  @ApiModelProperty()
  @IsString()
  readonly firstName: string;

  @ApiModelProperty()
  @IsString()
  readonly lastName: string;

  @ApiModelProperty()
  @IsString()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  readonly password: string;
}
