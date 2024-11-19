import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { JwtPayload } from './type/auth.jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async validateJwtPayload(payload: any) {
    try {
      return {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async register(
    username: string,
    password: string,
    roleName: string = 'Customer',
  ): Promise<User> {
    // Here you are using the createUser method from UserService to register a user
    const user = await this.userService.createUser(
      username,
      password,
      roleName,
    );

    // You can optionally return user details (avoid exposing password)
    return user;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
