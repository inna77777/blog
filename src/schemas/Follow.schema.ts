import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './User.schema';

@Schema()
export class Follow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  followerId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  followedUserId: string;
}
export const FollowSchema = SchemaFactory.createForClass(Follow);
