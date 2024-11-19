import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotFindUserException extends HttpException {
  constructor(username: string) {
    super(
      `Cannot find user with username '${username}'.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
