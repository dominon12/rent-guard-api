import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UsersService } from 'src/users/users.service';
import { Contract } from './schema/contract.schema';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    private usersService: UsersService,
    private propertiesService: PropertiesService,
  ) {}

  async create(
    createContractDto: CreateContractDto,
    email: string,
  ): Promise<Contract> {
    // check if user owns the property
    await this.propertiesService.checkUserOwnsProperty(
      createContractDto.property,
      email,
    );

    // create tenant
    const tenant = await this.usersService.createTenant(
      createContractDto.tenant,
    );

    // create contract
    const contract = await new this.contractModel({
      ...createContractDto,
      tenant: tenant._id,
    }).save();

    return contract;
  }

  async findOneByProperty(id: string, email: string): Promise<Contract> {
    // check if user owns the property
    await this.propertiesService.checkUserOwnsProperty(id, email);

    // get contract by property id
    const contract = await this.contractModel
      .findOne({ property: id })
      .populate('tenant')
      .exec();
    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    email: string,
  ): Promise<Contract> {
    // find property related to contract
    // and check if current user owns it
    const contract = await this.contractModel.findById(id).exec();
    await this.propertiesService.checkUserOwnsProperty(
      contract.property as unknown as string,
      email,
    );

    // update tenant account
    const tenant = await this.usersService.update(
      contract.tenant as unknown as string,
      updateContractDto.tenant,
    );

    // update contract
    const updatedContract = await this.contractModel
      .findByIdAndUpdate(
        contract._id,
        { ...updateContractDto, tenant: tenant._id },
        { new: true },
      )
      .exec();

    return updatedContract;
  }

  async remove(id: string, email: string): Promise<Contract> {
    // find property related to contract
    // and check if current user owns it
    const contract = await this.contractModel.findById(id).exec();
    await this.propertiesService.checkUserOwnsProperty(
      contract.property as unknown as string,
      email,
    );

    // delete contract
    const deletedContract = await this.contractModel
      .findByIdAndDelete(contract._id)
      .exec();

    // delete tenant
    await this.usersService.delete(contract.tenant as unknown as string);

    return deletedContract;
  }
}
