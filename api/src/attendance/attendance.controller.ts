import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CheckInDto } from './dto/checkin.dto';
import { User } from '../auth/decorators/user.decorator';
import { JwtPayload } from '../auth/strategy/jwt-payload.interface';
import { RequestWithUser } from '../types/RequestWithUser';

@Controller('/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ✅ 1. Check-In
  @Post('check-in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'write' })
  async checkIn(@Req() req: RequestWithUser, @Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(req.user, dto);
  }

  // ✅ 2. Check-Out
  @Put('check-out')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'write' })
  async checkOut(@User() user: JwtPayload) {
    return this.attendanceService.checkOut(user);
  }

  // ✅ 3. Get My Attendance
  @Get('my')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'read' })
  async getMyAttendance(@User() user: JwtPayload) {
    return this.attendanceService.getMyAttendance(user);
  }

  // ✅ 4. Get All Attendance
  @Get('all')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'read' })
  async getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }

  // ✅ 5. Get by User ID
  @Get(':userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'read' })
  async getAttendanceByUser(@Param('userId') userId: string) {
    return this.attendanceService.getAttendanceByUser(userId);
  }

  // ✅ 6. Attendance Stats
  @Get('stats')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'read' })
  async getStats() {
    return this.attendanceService.getAttendanceStats();
  }

  // ✅ 7. Bulk Upload
  @Post('bulk-upload')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'write' })
  async bulkUpload() {
    return this.attendanceService.bulkUpload();
  }

  // ✅ 8. Delete Attendance
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'delete' })
  async deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(id);
  }

  // ✅ 9. Update Attendance
  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'write' })
  async updateAttendance(
    @Param('id') id: string,
    @Body() dto: Partial<CheckInDto>,
  ) {
    return this.attendanceService.updateAttendance(id, dto);
  }

  // ✅ 10. Get Today Summary
  @Get('today')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ resource: 'attendance', action: 'read' })
  async getTodaySummary() {
    return this.attendanceService.getTodaySummary();
  }
}
