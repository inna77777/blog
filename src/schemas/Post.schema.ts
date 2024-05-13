import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose from 'mongoose';
import { User } from './User.schema';

@Schema()
export class Post {
  @Prop({ required: true })
  @IsString()
  title: string;
  @Prop({ required: true })
  @IsString()
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
