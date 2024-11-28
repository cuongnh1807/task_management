import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  @MaxLength(25)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'email',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 'a@gmail.com',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  @MaxLength(25)
  password: string;
}
