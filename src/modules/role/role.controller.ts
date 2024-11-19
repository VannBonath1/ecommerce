import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(@Body('name') name: string): Promise<Role> {
    return this.roleService.createRole(name);
  }

  @Get(':name')
  async findRoleByName(@Param('name') name: string): Promise<Role> {
    return this.roleService.findRoleByName(name);
  }
}
