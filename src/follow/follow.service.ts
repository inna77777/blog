import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from 'src/schemas/Follow.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async followPerson(currentUserId: string, userId: string) {
    const existingFollow = await this.followModel.findOne({
      followerId: currentUserId,
      followedById: userId,
    });

    if (existingFollow) {
      throw new HttpException('You already follow this user', 400);
    }

    const follow = await this.followModel.create({
      followerId: currentUserId,
      followedById: userId,
    });

    // await this.userModel.updateOne(
    //   { _id: currentUserId },
    //   {
    //     $push: {
    //       following: follow._id,
    //     },
    //   },
    // );

    return follow;
  }
  async deleteFollowing(currentUserId: string, userId: string) {
    const existingFollow = await this.followModel.findOne({
      followerId: currentUserId,
      followedById: userId,
    });
    if (!existingFollow) {
      throw new HttpException('You dont follow this user', 400);
    }
    return this.followModel.findByIdAndDelete(existingFollow._id);
  }

  async getFollowers(userId: string) {
    const followers = await this.followModel.find({ followedById: userId });
    const userFollowers = followers.map((follower) => follower.followerId);
    return await this.userModel.find(
      { _id: { $in: userFollowers } },
      '-login -password',
    );
  }
  async getFollowing(userId: string) {
    const following = await this.followModel.find({ followerId: userId });
    const userFollowing = following.map((follower) => follower.followedById);
    return await this.userModel.find(
      { _id: { $in: userFollowing } },
      '-login -password',
    );
  }
}
