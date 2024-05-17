// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/User.schema';
import { MailService } from '@sendgrid/mail';

// import {
//   UserSettings,
//   UserSettingsSchema,
// } from 'src/schemas/UserSettings.schema';
import { jwtConstants } from 'src/auth/constants';
import { Post, PostSchema } from 'src/schemas/Post.schema';
import { Comment, CommentSchema } from 'src/schemas/Comment.schema';
import { Like, LikeSchema } from 'src/schemas/Like.Schema';
import { Follow, FollowSchema } from 'src/schemas/Follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Post.name, schema: PostSchema },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Like.name,
        schema: LikeSchema,
      },
      { name: Follow.name, schema: FollowSchema },
    ]),
  ],
  providers: [UsersService, MailService],
  controllers: [UsersController],
})
export class UserModule {}
