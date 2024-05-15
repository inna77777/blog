import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentModule } from './comments/comments.module';
import { LikeModule } from './likes/likes.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URI'),
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({ dest: './uploads' }),
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,
    FollowModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
