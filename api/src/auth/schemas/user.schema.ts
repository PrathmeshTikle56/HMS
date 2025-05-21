import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'Employee', enum: ['Admin', 'Manager', 'Employee'] })
  role: string;

  @Prop({
    type: Object,
    default: {}, // Example: { users: ['read'], leaves: ['read', 'write'] }
  })
  customPermissions: Record<string, string[]>;
}

export const UserSchema = SchemaFactory.createForClass(User);
