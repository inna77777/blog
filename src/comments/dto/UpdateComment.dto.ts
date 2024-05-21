import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;
}
