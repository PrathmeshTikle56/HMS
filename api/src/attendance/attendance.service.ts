import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  // ✅ MARK ATTENDANCE
  async markAttendance(user, data) {
    if (!user.customPermissions?.['attendance']?.includes('write')) {
      throw new ForbiddenException('You do not have permission to mark attendance');
    }

    const userId = user.userId || user._id;
    const firstName = user.firstName;
    const lastName = user.lastName;

    if (!userId || !firstName || !lastName) {
      throw new BadRequestException('User information is incomplete.');
    }

    const today = data.date || new Date().toISOString().split('T')[0];

    const existing = await this.attendanceModel.findOne({ userId, date: today });

    if (existing) {
      // ✅ Already marked — update status/time
      existing.status = data.status || 'Present';
      existing.time = data.time || new Date().toLocaleTimeString();
      return existing.save();
    }

    const attendance = new this.attendanceModel({
      userId,
      firstName,
      lastName,
      date: today,
      time: data.time || new Date().toLocaleTimeString(),
      status: data.status || 'Present',
    });

    return attendance.save();
  }

  // ✅ GET ATTENDANCE
  async getAttendance(user) {
    if (!user.customPermissions?.['attendance']?.includes('read')) {
      throw new ForbiddenException('You do not have permission to view attendance');
    }

    const userId = user.userId || user._id;

    // ✅ HR/Admin => read all
    if (user.customPermissions?.['attendance']?.includes('readAll')) {
      return this.attendanceModel.find().sort({ date: -1 }).exec();
    }

    // ✅ Employee => only own records
    return this.attendanceModel.find().populate('userId', 'firstName lastName').exec();

  }

  // ✅ UPDATE ATTENDANCE (HR/Admin only)
  async updateAttendance(
    user: { userId: string; role: string; customPermissions: Record<string, string[]> },
    attendanceId: string,
    data: any,
  ) {
    if (!user.customPermissions?.['attendance']?.includes('update')) {
      throw new ForbiddenException('You do not have permission to update attendance');
    }

    return this.attendanceModel.findByIdAndUpdate(attendanceId, data, {
      new: true,
    }).exec();
  }
  async findByUser(userId: string) {
  return this.attendanceModel.find({ userId });
}
}
