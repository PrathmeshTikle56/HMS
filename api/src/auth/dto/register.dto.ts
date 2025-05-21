import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsIn(['Admin', 'Manager', 'Employee'], {
    message: 'Role must be Admin, Manager, or Employee',
  })
  role: string;
}
