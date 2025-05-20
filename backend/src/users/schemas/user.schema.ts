import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'admin',
  HR = 'hr',
  EMPLOYEE = 'employee',
}

export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  NO_ACCESS = 'no_access',
}

export interface Permission {
  userRoleAssignment: PermissionType;
  attendanceManagement: PermissionType;
  leaveManagement: PermissionType;
  approvalHistory: PermissionType;
  profileManagement: PermissionType;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);