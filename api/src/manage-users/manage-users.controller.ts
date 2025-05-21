import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ManageUsersService } from './manage-users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('manage-users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ManageUsersController {
  constructor(private readonly manageUsersService: ManageUsersService) {}

  @Post()
  @Permissions('write') 
  async createUser(@Req() req, @Body() body: any) {
    return this.manageUsersService.createUser(req.user, body);
  }

  @Delete(':id')
  @Permissions('delete') 
  async removeUser(@Req() req, @Param('id') id: string) {
    return this.manageUsersService.removeUser(req.user, id);
  }

  @Get()
  @Permissions('read') 
  async getAllUsers(@Req() req) {
    return this.manageUsersService.findAll(req.user);
  }
}
