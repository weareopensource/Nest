import { HttpException } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(error: string) {
    super(error, HttpStatus.FORBIDDEN);
  }
}
