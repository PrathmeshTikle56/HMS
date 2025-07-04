import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true })
  userId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  role: string;

  @Prop({ required: true })
  checkInTime: Date;

  @Prop()
  checkOutTime: Date;

  @Prop()
  totalHours: string; // e.g. "8h 45m"

  @Prop()
  location: string;

  @Prop({ default: false })
  checkedOut: boolean;

  @Prop({ default: false })
  leave: boolean; // optional field in case of leave marking
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
