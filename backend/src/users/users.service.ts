import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, PermissionType } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
    creatorRole: UserRole,
  ): Promise<User> {
    // Only SuperAdmin can create any user
    if (creatorRole !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Only SuperAdmin can create users');
    }

    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async createSuperAdmin(createUserDto: CreateUserDto): Promise<User> {
    // Check if any SuperAdmin already exists
    const existingSuperAdmin = await this.userModel.findOne({
      role: UserRole.SUPER_ADMIN,
    });
    if (existingSuperAdmin) {
      throw new ConflictException('SuperAdmin already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    });

    return createdUser.save();
  }

  async findAll(userRole: UserRole): Promise<User[]> {
    // Only SuperAdmin and Admin can view all users
    if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.ADMIN) {
      throw new UnauthorizedException('Insufficient permissions');
    }
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updaterRole: UserRole,
  ): Promise<User> {
    // Only SuperAdmin can update user roles
    if (updateUserDto.role && updaterRole !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Only SuperAdmin can update roles');
    }

    console.log('Updating user with ID:', id);

    const user = await this.userModel.findById(id);
    if (!user) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    Object.assign(user, updateUserDto);
    return user.save();
  }

  async remove(id: string, userRole: UserRole): Promise<User> {
    // Only SuperAdmin can delete users
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Only SuperAdmin can delete users');
    }

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Method to determine user permissions based on role
  getPermissions(role: UserRole) {
    const permissions = {
      userRoleAssignment: PermissionType.NO_ACCESS,
      attendanceManagement: PermissionType.NO_ACCESS,
      leaveManagement: PermissionType.NO_ACCESS,
      approvalHistory: PermissionType.NO_ACCESS,
      profileManagement: PermissionType.WRITE,
    };

    switch (role) {
      case UserRole.SUPER_ADMIN:
        permissions.userRoleAssignment = PermissionType.ADMIN;
        permissions.attendanceManagement = PermissionType.READ;
        permissions.leaveManagement = PermissionType.READ;
        permissions.approvalHistory = PermissionType.READ;
        break;
      case UserRole.ADMIN:
        permissions.attendanceManagement = PermissionType.READ;
        permissions.leaveManagement = PermissionType.READ;
        permissions.approvalHistory = PermissionType.READ;
        break;
      case UserRole.HR:
        permissions.attendanceManagement = PermissionType.WRITE;
        permissions.leaveManagement = PermissionType.WRITE;
        permissions.approvalHistory = PermissionType.READ;
        break;
      case UserRole.EMPLOYEE:
        permissions.attendanceManagement = PermissionType.WRITE;
        permissions.leaveManagement = PermissionType.WRITE;
        permissions.approvalHistory = PermissionType.READ;
        break;
    }

    return permissions;
  }
}
