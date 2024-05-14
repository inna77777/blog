import { Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
// import { UserSettings } from 'src/schemas/UserSettings.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/LoginUser.dto';
import * as bcrypt from 'bcrypt';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(UserSettings.name)
    // private userSettingsModel: Model<UserSettings>,
    private jwtService: JwtService,
  ) {
    cloudinary.config({
      cloud_name: 'dxqgupbf0',
      api_key: '322262275885774',
      api_secret: 'BG_pD1BIuvYXOzUIbw-Gzs2YLIk',
    });
  }

  async createUser({ /*settings,*/ password, ...createUserDto }: CreateUserDto) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // if (settings) {
    //   const newSettings = new this.userSettingsModel(settings);
    //   const savedSettings = await newSettings.save();
    //   const newUser = new this.userModel({
    //     ...createUserDto,
    //     password: hashedPassword,
    //     settings: savedSettings._id,
    //   });
    //   return newUser.save();
    // }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }
  getUserById(id: string) {
    return this.userModel.findById(id).populate('settings');
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true },
    );
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({
      login: loginUserDto.login,
    });

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new Error('Invalid credentials');
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
