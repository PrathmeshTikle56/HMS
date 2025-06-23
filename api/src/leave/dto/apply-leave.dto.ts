import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyLeaveDto {
  @IsNotEmpty()
  @IsString()
  startDate: Date;

  @IsNotEmpty()
  @IsString()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  dayType: string;

  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
