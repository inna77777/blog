import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from 'src/schemas/Like.Schema';
import { Post } from 'src/schemas/Post.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async addLike(postId: string, userId: string) {
    const existingLike = await this.likeModel.findOne({ postId, userId });
    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }
    const post = await this.postModel.findById(postId);
    if (!post) throw new HttpException('Post Not Found', 404);
    const like = await this.likeModel.create({ postId, userId });

    await post.updateOne({
      $push: {
        likes: like._id,
      },
    });
    return like;
  }
  async deleteLike(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new HttpException('Post Not Found', 404);
    const like = await this.likeModel.findOne({
      userId: userId,
      postId: postId,
    });

    await post.updateOne({
      $pull: {
        likes: like._id,
      },
    });
    return await this.likeModel.findByIdAndDelete(like._id);
  }

  async getAllLikes(postId: string) {
    return await this.likeModel.countDocuments({ postId: postId });
  }
}
