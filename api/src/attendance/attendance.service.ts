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

  // ✅ MARK ATTENDANCE (Location check removed)
  async markAttendance(user, data) {
    if (!user.customPermissions?.['attendance']?.includes('write')) {
      throw new ForbiddenException(
        'You do not have permission to mark attendance',
      );
    }

    const userId = user.userId || user._id;
    const firstName = user.firstName;
    const lastName = user.lastName;

    if (!userId || !firstName || !lastName) {
      throw new BadRequestException('User information is incomplete.');
    }

    const today = data.date || new Date().toISOString().split('T')[0];

    const existing = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    if (existing) {
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
      throw new ForbiddenException(
        'You do not have permission to view attendance',
      );
    }

    if (user.customPermissions?.['attendance']?.includes('readAll')) {
      return this.attendanceModel.find().sort({ date: -1 }).exec();
    }

    const userId = user.userId || user._id;
    return this.attendanceModel.find({ userId }).sort({ date: -1 }).exec();
  }

  // ✅ UPDATE ATTENDANCE
  async updateAttendance(user, attendanceId: string, data: any) {
    if (!user.customPermissions?.['attendance']?.includes('update')) {
      throw new ForbiddenException(
        'You do not have permission to update attendance',
      );
    }

    return this.attendanceModel
      .findByIdAndUpdate(attendanceId, data, { new: true })
      .exec();
  }

  // ✅ FIND BY USER
  async findByUser(userId: string) {
    return this.attendanceModel.find({ userId }).sort({ date: -1 }).exec();
  }

  // ✅ Get today's attendance for all users
  async getTodayAttendance(user) {
    if (!user.customPermissions?.['attendance']?.includes('readAll')) {
      throw new ForbiddenException(
        "You do not have permission to view today's attendance",
      );
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await this.attendanceModel
      .find({ date: { $gte: start.toISOString(), $lte: end.toISOString() } })
      .sort({ time: 1 })
      .populate('userId', 'firstName lastName') // ✅ Add this line
      .exec();

    return records;
  }

  // ✅ Get history of attendance (last 7 days)
  async getAttendanceHistory(user) {
    if (!user.customPermissions?.['attendance']?.includes('readAll')) {
      throw new ForbiddenException(
        'You do not have permission to view history',
      );
    }

    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);

    const records = await this.attendanceModel
      .find({ date: { $gte: from.toISOString() } })
      .sort({ date: -1, time: 1 })
      .populate('userId', 'firstName lastName') // ✅ Add this line
      .exec();

    return records;
  }
}
