import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './types/role.enum';
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

    const createdUser = await new this.userModel({
      ...createUserDto,
      role: Role.Owner,
    }).save();
    return createdUser;
  }

  async current(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async createTenant(createUserDto: CreateUserDto): Promise<User> {
    const createdTenant = await new this.userModel({
      ...createUserDto,
      role: Role.Tenant,
    }).save();

    // todo: create account in auth0 and send password on email

    return createdTenant;
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel
      .findOneAndUpdate({ email }, updateUserDto, { new: true })
      .exec();
    return updated;
  }

  async updateUnsafe(id: string, updateUserDto: UpdateUserDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return updated;
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    // todo: delete account in auth0

    return user;
  }
}
