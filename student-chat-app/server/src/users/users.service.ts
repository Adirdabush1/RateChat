import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }


async createUser(email: string, hashedPassword: string, role: string): Promise<User> {
  const newUser = new this.userModel({ email, password: hashedPassword, role });
  return newUser.save();
}


  async registerUser(email: string, password: string, role: string = 'student'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.createUser(email, hashedPassword, role);
  }

  async updateUserScore(email: string, amount: number): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { email },
      { $inc: { score: amount } },
      { new: true }
    ).exec();
  }
  async findById(id: string): Promise<User | null> {
  return this.userModel.findById(id);
}
}
