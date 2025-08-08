import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { IDType } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(IDType)
  id_type?: IDType;

  @IsOptional()
  @IsString()
  id_number?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  signature?: string;
}
