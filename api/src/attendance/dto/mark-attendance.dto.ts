import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class MarkAttendanceDto {
  @IsEnum(['Present', 'Absent', 'Late'], {
    message: 'Status must be Present, Absent, or Late',
  })
  status: 'Present' | 'Absent' | 'Late';

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date?: string;
}
