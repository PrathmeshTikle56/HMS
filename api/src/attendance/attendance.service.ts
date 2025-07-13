import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException, // ✅ Added this line
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { Model } from 'mongoose';
import { CheckInDto } from './dto/checkin.dto';
import { JwtPayload } from '../auth/strategy/jwt-payload.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  // ✅ 1. Check-In
  async checkIn(user: JwtPayload, dto: CheckInDto) {
  const todayStart = dayjs().startOf('day').toDate();

  const existing = await this.attendanceModel.findOne({
    userId: user.userId,
    checkInTime: { $gte: todayStart },
  });

  if (existing) {
    if (!existing.checkedOut) {
      return existing;
    } else {
      throw new ConflictException('Already checked out today. You cannot check in again.');
    }
  }

  // ✅ Create new check-in only if no record exists for today
  return this.attendanceModel.create({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    location: dto.location,
    checkInTime: new Date(),
    checkedOut: false,
  });
}


  // ✅ 2. Check-Out
  async checkOut(user: JwtPayload) {
    const todayStart = dayjs().startOf('day').toDate();

    const entry = await this.attendanceModel.findOne({
      userId: user.userId,
      checkInTime: { $gte: todayStart },
      checkedOut: false,
    });

    if (!entry) {
      throw new NotFoundException('No active check-in found today');
    }

    const now = new Date();
    entry.checkOutTime = now;
    entry.checkedOut = true;

    // ✅ Calculate total hours
    const diffMs = now.getTime() - new Date(entry.checkInTime).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    entry.totalHours = `${hours}h ${minutes}m`;

    return entry.save();
  }

  // ✅ 3. Get today's attendance (used for timer resume)
  async getTodayAttendance(user: JwtPayload) {
    const todayStart = dayjs().startOf('day').toDate();

    return this.attendanceModel.findOne({
      userId: user.userId,
      checkInTime: { $gte: todayStart },
    });
  }

  // ✅ 4. Get full history
  async getMyAttendance(user: JwtPayload) {
    return this.attendanceModel
      .find({ userId: user.userId })
      .sort({ checkInTime: -1 });
  }

  // ✅ 5. Admin: Today’s all user attendance
  async getTodayHistory(user: JwtPayload) {
    const allowedRoles = ['Admin', 'SuperAdmin', 'HR'];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    const todayStart = dayjs().startOf('day').toDate();
    return this.attendanceModel
      .find({ checkInTime: { $gte: todayStart } })
      .sort({ checkInTime: -1 });
  }

  // ✅ 6. Explicit - get today's attendance for self
  async getMyTodayAttendance(user: JwtPayload) {
    const todayStart = dayjs().startOf('day').toDate();

    return this.attendanceModel.findOne({
      userId: user.userId,
      checkInTime: { $gte: todayStart },
    });
  }
}
