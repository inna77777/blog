import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

// export class CreateUserSettingsDto {
//   @IsOptional()
//   @IsBoolean()
//   receiveNotifications?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   receiveEmails?: boolean;
//   @IsOptional()
//   @IsBoolean()
//   receiveSMS?: boolean;
// }

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  login: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  description?: string;
}
