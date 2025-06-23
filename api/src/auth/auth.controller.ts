import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateCompleteProfileDto } from './dto/update-complete-profile.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('first-user-check')
  async isFirstUser(): Promise<{ isFirst: boolean }> {
    const isFirst = await this.authService.isFirstUser(); // assuming the method is in UsersService
    return { isFirst };
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('complete-profile/:userId')
  @UseGuards(JwtAuthGuard)
  async updateCompleteProfile(
    @Req() req: any,
    @Param('userId') userId: string, // Optional from body
    @Body() dto: UpdateCompleteProfileDto,
  ) {
    const targetUserId = userId || req.user.userId; // HR/Employee distinction
    return this.authService.updateCompleteProfile(targetUserId, dto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: any) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      name:req.user.firstName,
      customPermissions: req.user.customPermissions,
      employeeId: req.user.employeeId,
    };
  }

  @Get('employee/:id')
  async getEmployeeById(@Param('id') id: string) {
    console.log('Employee ID:', id);
    return this.authService.findEmployeeById(id);
  }

  @Get('employees')
  async getEmployeesOnly() {
    return this.authService.findEmployeesOnly();
  }
}
