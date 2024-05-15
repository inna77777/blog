import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { UserSettings } from './UserSettings.schema';
import { Post } from './Post.schema';
import { Follow } from './Follow.schema';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  login: string;
  @Prop({ required: true })
  password: string;
  @Prop({ unique: true, required: true })
  nickname: string;

  @Prop({ required: false })
  description?: string;
  @Prop({ required: false })
  avatar?: string;
  @Prop({ required: false })
  background?: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings' })
  // settings?: UserSettings;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts?: Post[];
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Follow' }] })
  // followers?: Follow[];
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Follow' }] })
  // following?: Follow[];
  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
