import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose from 'mongoose';
import { User } from './User.schema';
import { Like } from './Like.Schema';

@Schema()
export class Post {
  @Prop({ required: true })
  @IsString()
  title: string;
  @Prop({ required: true })
  @IsString()
  content: string;
  @Prop({ required: true })
  @IsString()
  image: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments?: Comment[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes?: Like[];
  @Prop({ default: Date.now })
  created_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
