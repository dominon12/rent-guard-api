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
    const properties = this.propertyModel.find({ owner: user._id }).exec();
    return properties;
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
