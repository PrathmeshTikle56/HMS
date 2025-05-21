import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>) {}

  async markAttendance(user: { userId: string; role: string; permissions: string[] }, data: any) {
    if (!user.permissions.includes('write')) {
      throw new ForbiddenException('You do not have permission to mark attendance');
    }

    const attendanceData = {
      ...data,
      date: new Date(),
    };

    if (user.role === 'Employee') {
      attendanceData['user'] = user.userId;
    }

    const attendance = new this.attendanceModel(attendanceData);
    return attendance.save();
  }

  async getAttendance(user: { userId: string; role: string; permissions: string[] }) {
    if (!user.permissions.includes('read')) {
      throw new ForbiddenException('You do not have permission to view attendance');
    }

    if (user.role === 'Admin' || user.role === 'Manager') {
      return this.attendanceModel.find().exec();
    }

    return this.attendanceModel.find({ user: user.userId }).exec();
  }
}
