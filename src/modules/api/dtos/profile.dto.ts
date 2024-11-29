import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'a@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'password',
  })
  @IsOptional()
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

  @ApiPropertyOptional({
    example: 'a@gmail.com',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 'avatar_url',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar_url: string;
}

export class UpdateProfileExtendedDto extends UpdateProfileDto {
  @IsUUID(4)
  user_id: string;
}
