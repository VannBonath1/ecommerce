import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // Allow access if no role is required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Expecting JwtAuthGuard to populate this

    console.log('RolesGuard - Request User:', user); // Should not be undefined

    if (!user || !user.role) {
      console.error('RolesGuard - User or Role Missing');
      return false;
    }

    console.log('RolesGuard - User Role:', user.role);
    return user.role === requiredRole;
  }
}
