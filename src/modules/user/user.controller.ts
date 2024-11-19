import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body()
    createUserDto: {
      username: string;
      password: string;
      shopName: string;
      roleName?: string;
    },
  ) {
    const { username, password, roleName = 'Customer' } = createUserDto;
    const user = await this.userService.createUser(
      username,
      password,
      roleName,
    );
    return user;
  }

  @Get('name')
  async getUserByUserName(@Query('username') username: string): Promise<User> {
    return await this.userService.getUserByUserName(username);
  }
}
