import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './guard/roles.guard';
import { AuthService } from './modules/auth/auth.service';
import { Role } from './modules/role/roles.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @Get('profile')
  getProfile(@Request() req) {
    console.log('Request User in Controller:', req.user);
    // Access token values from the request object
    return {
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
    };
  }

  @Role('Admin') // Only allow users with 'admin' role
  @Get('admin')
  getAdminData() {
    return { message: 'Welcome Admin!' };
  }
}
