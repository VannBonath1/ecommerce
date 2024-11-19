import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT); // 409 status code for Conflict
  }
}
