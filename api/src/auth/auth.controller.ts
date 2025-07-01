import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
  Param,
  UseInterceptors,
  UploadedFile,
  
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateCompleteProfileDto } from './dto/update-complete-profile.dto';
import { Express } from 'express'; 
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';


@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('first-user-check')
  async isFirstUser(): Promise<{ isFirst: boolean }> {
    const isFirst = await this.authService.isFirstUser(); // assuming the method is in UsersService
    return { isFirst };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(
    @Req() req: any,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto,req.user?.userId);
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

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("HR")
  @Get('employee/:id')
  async getEmployeeById(@Param('id') id: string) {
    return this.authService.findEmployeeById(id);
  }

  @Post('upload-profile/:userId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req,  @Param('userId') userId: string,
) {
    const targetUserId = userId || req.user.userId;
    const imageUrl = `http://localhost:3000/uploads/profile-images/${file.filename}`;
    return this.authService.updateProfileImage(targetUserId, imageUrl);
  }


  @Patch('employee/:id')
  async updateProfile(
      @Param('id') userId: string,
      @Body() updateUserDto: UpdateCompleteProfileDto,
    ) {
      return this.authService.updateProfile(userId, updateUserDto);
    }
  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("HR","Admin")
  @Get('employees')
  async getEmployeesOnly() {
    return this.authService.findEmployeesOnly();
  }

  @Get('profile-image/:id')
  async getProfileImage(@Param('id') id: string) {
    const imageUrl = await this.authService.getProfileImage(id);
    return { imageUrl };
  }
@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.authService.forgotPassword(email);
}

@Post('reset-password')
async resetPassword(@Body() dto: { token: string; password: string }) {
  return this.authService.resetPassword(dto.token, dto.password);
}


}
