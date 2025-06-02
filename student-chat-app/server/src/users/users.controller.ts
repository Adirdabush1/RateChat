import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Get('children/:parentEmail')
  async getChildrenByParent(@Param('parentEmail') parentEmail: string) {
    return this.userModel.find({ role: 'student', parentEmail });
  }
}
