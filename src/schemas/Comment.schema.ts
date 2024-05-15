import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

@Schema()
export class Comment {
  @Prop({ required: true })
  @IsString()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: string;
  
  @Prop({ default: Date.now })
  created_at: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
