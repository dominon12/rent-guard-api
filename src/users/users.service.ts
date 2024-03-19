import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // don't create new user if already exists
    const user = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (user) return user;

    const createdUser = await new this.userModel(createUserDto).save();
    return createdUser;
  }

  async current(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel
      .findOneAndUpdate({ email }, updateUserDto, { new: true })
      .exec();
    return updated;
  }
}
