import { Controller, Post, Body, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('apply')
  @Permissions('leaves', 'write')
  async applyLeave(@Req() req: any, @Body() applyLeaveDto: ApplyLeaveDto) {
    return this.leaveService.applyLeave(req.user, applyLeaveDto);
  }

  @Get()
  @Permissions('leaves', 'read')
  async getLeaves(@Req() req: any) {
    return this.leaveService.fetchLeaves(req.user);
  }

  @Patch(':id/status')
  @Permissions('leaves', 'update')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    return this.leaveService.updateLeaveStatus(req.user, id, status);
  }
}
