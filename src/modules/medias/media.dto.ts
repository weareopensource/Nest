import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate } from 'class-validator';

export class MediaDto {
  @ApiModelProperty()
  @IsInt()
  readonly id?: number;

  @ApiModelProperty()
  @IsString()
  readonly title?: string;

  @ApiModelProperty()
  @IsString()
  readonly content?: string;

  @ApiModelProperty()
  @IsString()
  readonly mimeType?: string;

  @IsDate()
  readonly createdDate?: Date;

  @IsDate()
  readonly updatedDate?: Date;

  @ApiModelProperty()
  @IsInt()
  readonly commandId?: number;
}
