import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}
export const LikeSchema = SchemaFactory.createForClass(Like);
