import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotCreateShopForOtherAccountError extends HttpException {
  constructor(message: string) {
    super(
      message || 'You cannot create a shop for another account',
      HttpStatus.FORBIDDEN,
    ); // 403 Forbidden status
  }
}
