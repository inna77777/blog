import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemas/Comment.schema';
import { Post } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { UpdateCommentDto } from './dto/UpdateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addComment(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const findPost = await this.postModel.findById(postId);
    if (!findPost) throw new HttpException('Post Not Found', 404);
    const newComment = new this.commentModel({
      ...createCommentDto,
      userId,
      postId,
    });
    const savedComment = await newComment.save();
    await findPost.updateOne({
      $push: {
        comments: savedComment._id,
      },
    });
    return savedComment;
  }

  async getComments(postId: string) {
    const findPost = await this.postModel.findById(postId);
    if (!findPost) throw new HttpException('Post Not Found', 404);
    const comments = await this.commentModel
      .find({ postId: findPost._id })
      .populate('userId', 'nickname');
    return comments;
  }

  async deleteComments(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new HttpException('Comment Not Found', 404);
    const post = await this.postModel.findById(comment.postId);
    if (!post) throw new HttpException('Post Not Found', 404);

    if (
      comment.userId.toString() !== userId &&
      post.userId.toString() !== userId
    )
      return { message: 'You are not allowed to delete this comment' };

    const deletedComment = this.commentModel.findByIdAndDelete(commentId);
    await post.updateOne({
      $pull: {
        comments: commentId,
      },
    });
    return deletedComment;
  }

  async editComments(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new HttpException('Comment Not Found', 404);
    const post = await this.postModel.findById(comment.postId);
    if (!post) throw new HttpException('Post Not Found', 404);

    console.log(userId);
    console.log(comment.userId.toString());

    if (
      comment.userId.toString() !== userId &&
      post.userId.toString() !== userId
    )
      return { message: 'You are not allowed to edit this comment' };

    return this.commentModel.findByIdAndUpdate(commentId, updateCommentDto, {
      new: true,
    });
  }
}
