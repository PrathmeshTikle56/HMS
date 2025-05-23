/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './schemas/leave.schema';
import { ApplyLeaveDto } from './dto/apply-leave.dto';

@Injectable()
export class LeaveService {
  constructor(@InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>) {}

  async applyLeave(user: { userId: string; customPermissions: Record<string, string[]> }, data: ApplyLeaveDto) {
    if (!user.customPermissions['leaves']?.includes('write')) {
      throw new ForbiddenException('You do not have permission to apply for leave');
    }

    const leave = new this.leaveModel({
      userId: user.userId,
      status: 'Pending',
      ...data,
    });
    return leave.save();
  }

  async fetchLeaves(user: { userId: string; customPermissions: Record<string, string[]> }) {
    if (!user.customPermissions['leaves']?.includes('read')) {
      throw new ForbiddenException('You do not have permission to view leaves');
    }

    if (user.customPermissions['leaves'].includes('readAll')) {
      return this.leaveModel.find().exec();
    }

    return this.leaveModel.find({ userId: user.userId }).exec();
  }

  async updateLeaveStatus(
    user: { userId: string; customPermissions: Record<string, string[]> },
    id: string,
    status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    if (!user.customPermissions['leaves']?.includes('update')) {
      throw new ForbiddenException('You do not have permission to update leave status');
    }

    const leave = await this.leaveModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }

    return leave;
  }
}