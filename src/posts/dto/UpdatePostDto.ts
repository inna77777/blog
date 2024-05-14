import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  image?: Express.Multer.File;
}
