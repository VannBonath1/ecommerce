import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedUserException extends HttpException {
  constructor(message: string = 'Unauthorized user') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
