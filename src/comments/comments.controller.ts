import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/UpdateComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Post('add/post/:postId')
  @UsePipes(new ValidationPipe())
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    return this.commentsService.addComment(
      postId,
      req.user.sub,
      createCommentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('all/post/:postId')
  getComments(@Param('postId') postId: string) {
    return this.commentsService.getComments(postId);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:commentId')
  deleteComments(@Param('commentId') commentId: string, @Request() req) {
    return this.commentsService.deleteComments(commentId, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:commentId')
  Comments(
    @Param('commentId') commentId: string,
    @Request() req,
    @Body()
    updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.editComments(
      commentId,
      req.user.sub,
      updateCommentDto,
    );
  }
}
