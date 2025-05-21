import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @Permissions('write')
  async markAttendance(@Req() req, @Body() body: any) {
    return this.attendanceService.markAttendance(req.user, body);
  }

  @Get()
  @Permissions('read')
  async getAttendance(@Req() req) {
    return this.attendanceService.getAttendance(req.user);
  }
}
