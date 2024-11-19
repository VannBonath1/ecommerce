import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException } from 'src/filters/invalid-credentials.exception';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    createUserDto: {
      username: string;
      password: string;
      roleName?: string;
    },
  ) {
    const { username, password, roleName = 'Customer' } = createUserDto;
    return await this.authService.register(username, password, roleName);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new InvalidCredentialsException();
    }
    return this.authService.login(user);
  }
}
