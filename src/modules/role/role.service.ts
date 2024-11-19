import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleAlreadyExistsException } from 'src/filters/role-already-exists.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string): Promise<Role> {
    try {
      const existedRole = this.roleRepository.findOne({
        where: { name: name },
      });
      if (existedRole) {
        throw new RoleAlreadyExistsException('');
      }
      const role = new Role();
      role.name = name;
      return this.roleRepository.save(role);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findRoleByName(name: string): Promise<Role> {
    try {
      return this.roleRepository.findOne({ where: { name } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
