import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CannotFindUserException } from 'src/filters/cannot-find-user.exception';
import { Shop } from '../shop/shop.entity';
import { UserAlreadyExistsException } from 'src/filters/UserAlreadyExistsException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createUser(
    username: string,
    password: string,
    roleName: string = 'Customer',
  ): Promise<User> {
    try {
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!role) {
        throw new Error('Role not found');
      }
      const existingUser = await this.userRepository.findOne({
        where: { username: username },
      });
      if (existingUser) {
        throw new UserAlreadyExistsException();
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      user.role = role;

      return this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserByUserName(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: username },
        relations: ['role', 'shops'], // Correctly querying by username
      });

      if (!user) {
        throw new CannotFindUserException('');
      }

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
