import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  date: string; // Format: YYYY-MM-DD

  @Prop({ default: 'Absent', enum: ['Present', 'Absent', 'Late'] })
  status: string;

  @Prop()
  time: string;
}

export type AttendanceDocument = Attendance & Document;
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
