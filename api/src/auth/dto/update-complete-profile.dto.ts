import { BasicDetailsDto } from './basic-details.dto';
import { EducationDetailsDto } from './education-details.dto';
import { BankDetailsDto } from './bank-details.dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';

export class UpdateCompleteProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => BasicDetailsDto)
  basicDetails?: BasicDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EducationDetailsDto)
  educationDetails?: EducationDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails?: BankDetailsDto;
}
