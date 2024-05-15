import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from 'src/schemas/Like.Schema';
import { Post, PostSchema } from 'src/schemas/Post.schema';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikeModule {}
