import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // /users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  // @Patch(':id')
  // @UsePipes(new ValidationPipe())
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const isValid = mongoose.Types.ObjectId.isValid(id);
  //   if (!isValid) throw new HttpException('Invalid ID', 400);
  //   const updateUser = await this.usersService.updateUser(id, updateUserDto);
  //   if (!updateUser) throw new HttpException('User update not found', 404);

  //   return updateUser;
  // }
  @UseGuards(AuthGuard)
  @Patch('edit')
  @UsePipes(new ValidationPipe())
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const isValid = mongoose.Types.ObjectId.isValid(req.user.sub);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const updateUser = await this.usersService.updateUser(
      req.user.sub,
      updateUserDto,
    );
    if (!updateUser) throw new HttpException('User update not found', 404);

    return updateUser;
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteUser(@Request() req) {
    const isValid = mongoose.Types.ObjectId.isValid(req.user.sub);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const deletedUser = await this.usersService.deleteUser(req.user.sub);
    if (!deletedUser) throw new HttpException('User update not found', 404);
    return;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const tokenResponse = await this.usersService.login(loginUserDto);
      return tokenResponse;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      // , {
      //   storage: diskStorage({
      //     destination: './uploads',
      //     filename: (req, file, cb) => {
      //       cb(null, file.originalname);
      //     },
      //   }),
      // }
    ),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log('Uploaded file:', file);
    try {
      console.log(file);

      const result = await this.usersService.uploadImage(file.path);

      return result;
    } catch (err) {
      console.error('Error uploading image', err);
      throw new Error('Failed to upload image');
    }
  }

  // @Get('/getFile/file')
  // getFile(@Res() res: Response, @Body() file: FileParams) {
  //   res.sendFile(path.join(__dirname, '../../uploads/' + file.avatar));
  // }
}
