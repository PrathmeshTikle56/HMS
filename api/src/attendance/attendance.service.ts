import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';

// Office Coordinates (adjust as needed)
const OFFICE_LAT = 22.7196; // example: Indore
const OFFICE_LNG = 75.8577;
const MAX_DISTANCE_METERS = 2000;

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

    const { latitude, longitude } = data;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new BadRequestException('Location coordinates are required.');
    }

    const isWithinRange = this.isWithinOfficeRange(latitude, longitude);
    if (!isWithinRange) {
      throw new ForbiddenException('You are not within office range to mark attendance');
    }

    const today = data.date || new Date().toISOString().split('T')[0];

    const existing = await this.attendanceModel.findOne({ userId, date: today });

    if (existing) {
      existing.status = data.status || 'Present';
      existing.time = data.time || new Date().toLocaleTimeString();
      existing.latitude = latitude;
      existing.longitude = longitude;
      return existing.save();
    }

    const attendance = new this.attendanceModel({
      userId,
      firstName,
      lastName,
      date: today,
      time: data.time || new Date().toLocaleTimeString(),
      status: data.status || 'Present',
      latitude,
      longitude,
    });

    return attendance.save();
  }

  // ✅ CHECK DISTANCE
  private isWithinOfficeRange(lat: number, lng: number): boolean {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(OFFICE_LAT);
    const φ2 = toRad(lat);
    const Δφ = toRad(lat - OFFICE_LAT);
    const Δλ = toRad(lng - OFFICE_LNG);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance <= MAX_DISTANCE_METERS;
  }

  // ✅ GET ATTENDANCE
  async getAttendance(user) {
    if (!user.customPermissions?.['attendance']?.includes('read')) {
      throw new ForbiddenException('You do not have permission to view attendance');
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
      throw new ForbiddenException('You do not have permission to update attendance');
    }

    return this.attendanceModel.findByIdAndUpdate(attendanceId, data, {
      new: true,
    }).exec();
  }

  // ✅ FIND BY USER
  async findByUser(userId: string) {
    return this.attendanceModel.find({ userId }).sort({ date: -1 }).exec();
  }
}
