import { Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/LoginUser.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '@sendgrid/mail';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Post } from 'src/schemas/Post.schema';
import { Comment } from 'src/schemas/Comment.schema';
import { Like } from 'src/schemas/Like.Schema';
import { Follow } from 'src/schemas/Follow.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    this.mailService.setApiKey(this.configService.get<string>('SENDGRID_API'));

    cloudinary.config({
      cloud_name: 'dxqgupbf0',
      api_key: '322262275885774',
      api_secret: 'BG_pD1BIuvYXOzUIbw-Gzs2YLIk',
    });
  }

  async createUser({
    /*settings,*/ password,
    ...createUserDto
  }: CreateUserDto) {
    const existingUserWithEmail = await this.userModel.findOne({
      login: createUserDto.login,
    });

    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(password)) {
      return { message: 'Password must contain both letters and numbers' };
    }
    if (existingUserWithEmail) {
      return { message: 'Email already exists' };
    }

    if (createUserDto.nickname) {
      const existingUserWithNickname = await this.userModel.findOne({
        nickname: createUserDto.nickname,
      });
      if (existingUserWithNickname) {
        return { message: 'Nickname already exists' };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const msg = {
      to: createUserDto.login,
      from: this.configService.get<string>('EMAIL'),
      subject: 'Welcome!!!',
      text: 'Welcome to camping blog!!!!',
      html: `<div><p>We're happy to see you on our site! Whether you're a seasoned camper or just starting out, our blog is here to provide you with tips, guides, and inspiration for your next adventure.</p> <p>With love, your camping team <3 </p></div> `,
    };
    await this.mailService.send(msg);
    console.log('Email sent!');

    return newUser.save();
  }

  getUsers() {
    // return this.userModel.find().populate(['posts'] );
    return this.userModel.find().select('-login -password').populate(['posts']);
  }
  async getUserById(id: string, currentUserId: string) {
    const user: any = await this.userModel.findById(id, '-login -password');
    let isFollowing: boolean;
    if (user) {
      const follow = await this.followModel.findOne({
        followedById: currentUserId,
        followerId: id,
      });
      console.log('aaa', follow);
      if (follow) {
        isFollowing = true;
      } else {
        isFollowing = false;
      }
    }

    return { ...user._doc, isFollowing: isFollowing };
  }

  getUserCurrent(id: string) {
    return this.userModel.findById(id, '-login -password');
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.login) {
      const existingUserWithEmail = await this.userModel.findOne({
        login: updateUserDto.login,
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        return { message: 'Email already exists' };
      }
    }

    if (updateUserDto.nickname) {
      const existingUserWithNickname = await this.userModel.findOne({
        nickname: updateUserDto.nickname,
      });
      if (existingUserWithNickname && existingUserWithNickname.id !== id) {
        return { message: 'Nickname already exists' };
      }
    }

    if (updateUserDto.password) {
      if (
        !/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(updateUserDto.password)
      ) {
        return { message: 'Password must contain both letters and numbers' };
      }
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateUserDto },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      return { message: 'Error updating user' };
    }
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new Error('User not found');
    }
    await this.postModel.deleteMany({ userId: user._id });
    await this.commentModel.deleteMany({ postId: { $in: user.posts } });
    await this.likeModel.deleteMany({ postId: { $in: user.posts } });
    await this.followModel.deleteMany({
      $or: [{ followerId: user._id }, { followedById: user._id }],
    });
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({
      login: loginUserDto.login,
    });

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      return { message: 'Email or password is wrong' };
    }

    const payload = { username: user.login, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
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
}
