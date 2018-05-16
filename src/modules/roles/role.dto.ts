import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsArray } from 'class-validator';

export class RoleDto {
  @ApiModelProperty()
  @IsInt()
  readonly id ? : number;

  @ApiModelProperty()
  @IsString()
  readonly name ? : string;

  @IsDate()
  readonly createdDate ? : Date;

  @IsDate()
  readonly updatedDate ? : Date;

  @ApiModelProperty()
  @IsArray()
  readonly prothesistIds ? : number[];
}
