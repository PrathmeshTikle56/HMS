import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './schemas/leave.schema';
// import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 🧠 Utility to calculate working leave days
  private calculateLeaveDays(
    startDate: string,
    endDate: string,
    dayType: string,
  ): number {
    if (dayType?.toLowerCase() === 'halfday') return 0.5;

    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay(); // Sunday = 0, Saturday = 6
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  // 📝 Apply for a new leave
  async applyLeave(
    user: { userId: string; customPermissions: Record<string, string[]> },
    data: any,
  ) {
    if (!user.customPermissions['leaves']?.includes('write')) {
      throw new ForbiddenException(
        'You do not have permission to apply for leave',
      );
    }

    const { startDate, endDate, dayType } = data;

    // 🔁 Check for overlapping leave
    const overlappingLeave = await this.leaveModel.findOne({
      userId: user.userId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (overlappingLeave) {
      throw new BadRequestException(
        'You already have a leave request for this date range',
      );
    }

    const noOfDays = this.calculateLeaveDays(startDate, endDate, dayType);

    const leave = new this.leaveModel({
      ...data,
      userId: user.userId,
      status: 'Pending',
      noOfDays,
    });

    return leave.save();
  }

  // 📄 Fetch all or personal leaves
  async fetchLeaves(user: {
    userId: string;
    customPermissions: Record<string, string[]>;
  }) {
    if (!user.customPermissions['leaves']?.includes('read')) {
      throw new ForbiddenException('You do not have permission to view leaves');
    }

    // 🔐 Admin/HR view all
    if (user.customPermissions['leaves'].includes('readAll')) {
      return this.leaveModel
        .find()
        .populate('userId', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .exec();
    }

    // 👤 Employee sees only own leaves
    return this.leaveModel
      .find({ userId: user.userId })
      .populate([
        { path: 'approvedBy', select: 'firstName lastName' },
        { path: 'userId', select: 'firstName lastName leaves' },
      ])
      .sort({ createdAt: -1 })
      .exec();
  }

  // ✅ Approve / Reject leave
  async updateLeaveStatus(
    user: { userId: string; customPermissions: Record<string, string[]> },
    id: string,
    status: string,
  ) {
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Allowed values are: ${validStatuses.join(', ')}`,
      );
    }

    if (!user.customPermissions['leaves']?.includes('update')) {
      throw new ForbiddenException(
        'You do not have permission to update leave status',
      );
    }

    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      {
        status,
        approvedBy: status === 'Approved' ? user.userId : null,
      },
      { new: true },
     )
    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }

    return leave;
  }
}

    // const currentUser = await this.userModel.findByIdAndUpdate(
    //   user.userId,
    //   {
    //     ...user,
    //     leaves:{
    //       ...user?.leaves,
    //       plLeft:
    //     }        
    //   }      
    // )s