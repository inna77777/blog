import { Type } from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  @IsString()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  description?: string;

  // @ValidateNested()
  // @IsOptional()
  // @Type(()=> CreateUserSettingsDto)
  // settings?: CreateUserSettingsDto;
}
