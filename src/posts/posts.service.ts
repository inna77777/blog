import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.schema';
import { CreatePostDto } from './dto/CreatePost.dto';
import { User } from 'src/schemas/User.schema';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    cloudinary.config({
      cloud_name: 'dxqgupbf0',
      api_key: '322262275885774',
      api_secret: 'BG_pD1BIuvYXOzUIbw-Gzs2YLIk',
    });
  }

  async createPost(
    createPostDto: CreatePostDto,
    image: Express.Multer.File,
    userId: string,
  ) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    const uploadResult = await this.uploadImage(image);
    const newPost = new this.postModel({
      ...createPostDto,
      user: userId,
      image: uploadResult.url,
    });
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });
    return savedPost;
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    image: Express.Multer.File,
    id: string,
  ) {
    console.log(id);

    const { ...updateData } = updatePostDto;

    const post = await this.postModel.findById(id);
    if (!post) {
      throw new HttpException('Post Not Found', 404);
    }

    let imageUrl = post.image;
    if (image) {
      const uploadResult = await this.uploadImage(image);
      imageUrl = uploadResult.url;
    }

    post.set({
      ...updateData,
      image: imageUrl,
    });

    const updatedPost = await post.save();
    return updatedPost;
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      cloudinary.uploader.upload(
        'data:' + file.mimetype + ';base64,' + file.buffer.toString('base64'),
        { folder: 'blog', resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  getPostById(id: string) {
    return this.postModel.findById(id);
  }
}
