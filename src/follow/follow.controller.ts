import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(AuthGuard)
  @Post('user/:userId')
  followPerson(@Request() req, @Param('userId') userId: string) {
    return this.followService.followPerson(req.user.sub, userId);
  }
  @UseGuards(AuthGuard)
  @Delete('delete/user/:userId')
  deleteFollowing(@Request() req, @Param('userId') userId: string) {
    return this.followService.deleteFollowing(req.user.sub, userId);
  }
  @UseGuards(AuthGuard)
  @Get('user/followers')
  getFollowers(@Request() req) {
    return this.followService.getFollowers(req.user.sub);
  }
  @UseGuards(AuthGuard)
  @Get('user/following')
  getFollowing(@Request() req) {
    return this.followService.getFollowing(req.user.sub);
  }
}
