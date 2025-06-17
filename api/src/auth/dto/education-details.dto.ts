import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class EducationDetailsDto {
  @IsString()
  @IsNotEmpty()
  highestQualification: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsNotEmpty()
  yearOfPassing: number;

  @IsString()
  @IsNotEmpty()
  grade: string;
}
