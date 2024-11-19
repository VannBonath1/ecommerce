import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleAlreadyExistsException extends HttpException {
  constructor(roleName: string) {
    super(`Role '${roleName}' already exists.`, HttpStatus.CONFLICT);
  }
}
