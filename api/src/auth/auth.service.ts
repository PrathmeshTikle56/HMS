import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateCompleteProfileDto } from './dto/update-complete-profile.dto';
import { PERMISSIONS } from './constants/permissions.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async isFirstUser(): Promise<boolean> {
    const count = await this.userModel.countDocuments();
    return count === 0;
  }

  async register(registerDto: RegisterDto, creatorId?: string) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email');
    }
    const totalUsers = await this.userModel.countDocuments();
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
    let role = 'Employee';
    let customPermissions: Record<string, string[]> = {};
  
    if (totalUsers === 0) {
      // First user becomes SuperAdmin
      role = 'SuperAdmin';
      customPermissions = PERMISSIONS[role];
    } else {
      // Later users — role is selected from DTO
      role = registerDto.role || 'Employee';
      customPermissions = PERMISSIONS[role] || {};
    }
  
    const employeeId = `EMP${Date.now()}${Math.floor(Math.random() * 10000)}`;
  
    const createdUser = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      role,
      createdBy: creatorId,
      customPermissions,
      employeeId,
    });
  
    const savedUser = await createdUser.save();
  
    return {
      message: `${savedUser.role} registered successfully`,
      userId: savedUser._id,
      createdBy: savedUser.createdBy,
      role: savedUser.role,
      employeeId: savedUser.employeeId,
    };
  }
  
  

  async updateCompleteProfile(userId: string, dto: UpdateCompleteProfileDto) {
    // console.log(userId);

    const { basicDetails, educationDetails, bankDetails } = dto;

    // Determine leave policy based on employmentType
    let paidLeaveAllowed = 0;
    let wfhAllowed = 0;

    const empType = basicDetails?.employmentType?.toLowerCase();

    if (empType === 'full-time') {
      paidLeaveAllowed = 1.5;
      wfhAllowed = 1;
    } else if (empType === 'intern') {
      paidLeaveAllowed = 0;
      wfhAllowed = 0;
    }

    const updateData = {
      ...basicDetails,
      ...educationDetails,
      ...bankDetails,
      paidLeaveAllowed,
      wfhAllowed,
    };

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }


  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      customPermissions: user.customPermissions,
      employeeId: user.employeeId,
      name:user.firstName + " " + user.lastName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        name:user.firstName + " " + user.lastName,
      },
    };
  }

  async findEmployeesOnly() {
    return this.userModel.find({
      role: { $nin: ['SuperAdmin', 'Admin', 'HR'] },
    });
  }

  async findEmployeeById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateCompleteProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Flatten the nested DTOs into a single update object
    const flatUpdate = {
      ...(updateUserDto.basicDetails || {}),
      ...(updateUserDto.bankDetails || {}),
      ...(updateUserDto.educationDetails || {}),
    };

    // Update the user directly with flattened data
    Object.assign(user, flatUpdate);

    await user.save();
    return { message: 'Profile updated successfully', user };
  }


  async updateProfileImage(userId: string, imageUrl: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true },
    );
  }

  async getProfileImage(userId: string){
    const user = await this.userModel.findById(userId);
    return user?.profileImage;
  }

}
