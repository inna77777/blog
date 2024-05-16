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
import { MailService } from '@sendgrid/mail';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(UserSettings.name)
    // private userSettingsModel: Model<UserSettings>,
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
    // Hash the password
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
  getUserById(id: string) {
    return this.userModel.findById(id, '-login -password');
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
