import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';

export class LoginDto {
  @ApiModelProperty()
  @IsString()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  readonly password: string;
}
