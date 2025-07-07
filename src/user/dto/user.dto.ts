import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;
}
