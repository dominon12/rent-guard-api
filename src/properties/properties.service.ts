import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './schema/property.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    private usersService: UsersService,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    email: string,
  ): Promise<Property> {
    const user = await this.usersService.current(email);
    const property = new this.propertyModel({
      owner: user._id,
      ...createPropertyDto,
    });
    return property.save();
  }

  async findAll(email: string): Promise<Property[]> {
    const user = await this.usersService.current(email);
    const properties = this.propertyModel
      .find({ owner: user._id })
      .sort({ createdAt: 'desc' })
      .exec();
    return properties;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    email: string,
  ): Promise<Property> {
    const user = await this.usersService.current(email);
    const updated = await this.propertyModel
      .findOneAndUpdate({ _id: id, owner: user._id }, updatePropertyDto, {
        new: true,
      })
      .exec();
    return updated;
  }

  async remove(id: string, email: string): Promise<Property> {
    const user = await this.usersService.current(email);
    const deleted = await this.propertyModel
      .findOneAndDelete({
        _id: id,
        owner: user._id,
      })
      .exec();
    return deleted;
  }
}
