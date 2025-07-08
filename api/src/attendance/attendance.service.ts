import {
  Injectable,
  NotFoundException,
  ConflictException,
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
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async checkIn(user: JwtPayload, dto: CheckInDto) {
    const todayStart = dayjs().startOf('day').toDate();

    const alreadyCheckedIn = await this.attendanceModel.findOne({
      userId: user.userId,
      checkInTime: { $gte: todayStart },
    });

    if (alreadyCheckedIn) {
      throw new ConflictException('Already checked in today');
    }

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

    const durationMs = new Date(entry.checkOutTime).getTime() - new Date(entry.checkInTime).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    entry.totalHours = `${hours}h ${minutes}m`;

    return entry.save();
  }

 
  async getMyAttendance(user: JwtPayload) {
    return this.attendanceModel.find({ userId: user.userId }).sort({ checkInTime: -1 });
  }

  
  async getAllAttendance() {
    return this.attendanceModel.find().sort({ checkInTime: -1 });
  }


  async getAttendanceByUser(userId: string) {
    return this.attendanceModel.find({ userId }).sort({ checkInTime: -1 });
  }

  async getAttendanceStats() {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const records = await this.attendanceModel.find({
      checkInTime: { $gte: todayStart, $lte: todayEnd },
    });

    const present = records.length;
    const leaves = records.filter((r) => r.leave === true).length;
    const absent = 0; // For now (unless using a scheduler)

    return {
      presentCount: present,
      leaveCount: leaves,
      absentCount: absent,
    };
  }
  async bulkUpload() {
    // ⛔ Implement CSV/Excel parsing separately
    return { message: 'Bulk upload not implemented yet' };
  }

  async deleteAttendance(id: string) {
    const result = await this.attendanceModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Attendance not found');
    return { message: 'Deleted successfully' };
  }

  async updateAttendance(id: string, dto: Partial<CheckInDto>) {
    const updated = await this.attendanceModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!updated) throw new NotFoundException('Attendance not found');
    return updated;
  }

  
  async getTodaySummary() {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const records = await this.attendanceModel.find({
      checkInTime: { $gte: todayStart, $lte: todayEnd },
    });

    const present = records.length;
    const leaves = records.filter((r) => r.leave === true).length;
    const absent = 0; // You can calculate based on registered users

    return {
      presentCount: present,
      leaveCount: leaves,
      absentCount: absent,
    };
  }
}
