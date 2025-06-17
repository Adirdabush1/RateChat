import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterParentDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEmail()
  childEmail: string;
}
