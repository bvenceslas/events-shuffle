import { IsOptional, IsString } from 'class-validator';

export class SignUpUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
