import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApplyLeaveDto } from './dto/apply-leave.dto';

@Controller('leaves')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Permissions('write')  
  async applyLeave(@Req() req, @Body() applyLeaveDto: ApplyLeaveDto) {
    return this.leaveService.applyLeave(req.user, applyLeaveDto);
  }

  @Get()
  @Permissions('read')  
  async fetchLeaves(@Req() req) {
    return this.leaveService.fetchLeaves(req.user);
  }

  @Patch(':id')
  @Permissions('update') 
  async updateLeaveStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.leaveService.updateLeaveStatus(req.user, id, body.status);
  }
}