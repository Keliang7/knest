import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { IDType } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(1, 50)
  nickname: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  telephone: string;

  @IsEnum(IDType)
  id_type: IDType;

  @IsString()
  id_number: string;

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
