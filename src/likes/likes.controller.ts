import {
  ConflictException,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likeService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post('add/post/:postId')
  async addLike(@Param('postId') postId: string, @Request() req) {
    try {
      return await this.likeService.addLike(postId, req.user.sub);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException('You have already liked this post', 409);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/post/:postId')
  deleteLike(@Param('postId') postId: string, @Request() req) {
    return this.likeService.deleteLike(postId, req.user.sub);
  }
}
