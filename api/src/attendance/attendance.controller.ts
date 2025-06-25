import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ✅ Get All Attendance (Admin/HR)
  @Get('all')
  getAll(@Req() req) {
    return this.attendanceService.getAttendance(req.user);
  }

  // ✅ Mark Attendance (Employee)
  @Post('mark')
  mark(@Req() req, @Body() body: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(req.user, body);
  }

  // ✅ Get My Attendance (Employee)
  @Get('my')
  getMyAttendance(@Req() req) {
    return this.attendanceService.findByUser(req.user._id);
  }

  // ✅ Update Attendance (Admin/HR)
  @Put(':id')
  updateAttendance(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(req.user, id, body);
  }
  // ✅ Get today's attendance for all users
  @Get('today')
  getTodayAttendance(@Req() req) {
    return this.attendanceService.getTodayAttendance(req.user);
  }

  // ✅ Get past attendance history (e.g. for last 7 days)
  @Get('history')
  getAttendanceHistory(@Req() req) {
    return this.attendanceService.getAttendanceHistory(req.user);
  }
}
