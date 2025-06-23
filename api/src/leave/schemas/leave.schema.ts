import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class Leave {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  reason: string;

  @Prop({
    default: 'fullday',
    enum: ['fullday', 'halfday'],
  })
  dayType: string;

  @Prop({
    default: 'casual',
    enum: ['sick', 'casual'],
  })
  leaveType: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
  status: string;
}

export type LeaveDocument = Leave & Document;
export const LeaveSchema = SchemaFactory.createForClass(Leave);
