import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      console.error(
        'JwtAuthGuard Error or User Missing:',
        err || info?.message,
      );
      throw err || new UnauthorizedException();
    }

    return user; // This user will be attached to request.user
  }
}
