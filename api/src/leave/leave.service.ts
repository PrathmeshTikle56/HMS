import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './schemas/leave.schema';
import { PERMISSIONS } from '../auth/constants/permissions.constant';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
  ) {}

  async applyLeave(user: { userId: string; role: string }, data: any) {
    const leave = new this.leaveModel({
      ...data,
      userId: user.userId,
      status: 'Pending',
    });
    return leave.save();
  }

  async fetchLeaves(user: { userId: string; role: string }) {
    if (user.role === 'Admin') {
      return this.leaveModel.find().exec();
    }

    if (user.role === 'Manager') {
      return this.leaveModel.find({ userId: user.userId }).exec();
    }

    return this.leaveModel.find({ userId: user.userId }).exec();
  }

  async updateLeaveStatus(
    user: { userId: string; role: string },
    id: string,
    status: string,
  ) {
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Allowed values are: ${validStatuses.join(', ')}`,
      );
    }

    // Check if the user's role includes 'update' permission
    if (!PERMISSIONS[user.role].includes('update')) {
      throw new ForbiddenException(
        'You do not have permission to update leave status',
      );
    }

    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }

    return leave;
  }
}
