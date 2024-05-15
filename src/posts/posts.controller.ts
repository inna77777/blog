import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePost.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePostDto } from './dto/UpdatePostDto';
import mongoose, { Types } from 'mongoose';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    return this.postsService.createPost(createPostDto, image, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:postId')
  @UseInterceptors(FileInterceptor('image'))
  updatePost(
    @Param('postId') postId: string,
    @UploadedFile()
    image: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    console.log(postId);

    if (!Types.ObjectId.isValid(postId)) {
      throw new HttpException('Invalid post id', 400);
    }

    return this.postsService.updatePost(updatePostDto, image, postId);
  }

  @UseGuards(AuthGuard)
  @Get('post/:id')
  async getPostById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Post not found', 404);
    const findUser = await this.postsService.getPostById(id);
    if (!findUser) throw new HttpException('Post not found', 404);
    return findUser;
  }

  @UseGuards(AuthGuard)
  @Get('all/user/:id')
  async getAllPostsOfUser(@Param('id') id: string) {
   return this.postsService.getAllPostsOfUser(id)
  }
  
  @UseGuards(AuthGuard)
  @Get('all')
  async getAllPosts() {
   return this.postsService.getAllPosts()
  }


  //! new route
  @UseGuards(AuthGuard)
  @Delete('delete/post/:id')
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.postsService.deletePost(id, req.user.sub);
  }
}
