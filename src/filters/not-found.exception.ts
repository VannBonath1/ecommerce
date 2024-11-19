import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExceptionCustom extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND); // 404 status code for Not Found
  }
}
