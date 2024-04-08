import { FilterQuery, Model } from 'mongoose';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './schema/contract.schema';
import { PropertiesService } from 'src/properties/properties.service';
import { InvoicesService } from 'src/invoices/invoices.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    private propertiesService: PropertiesService,
    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService,
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

    // create contract
    const contract = await new this.contractModel(createContractDto).save();

    return contract;
  }

  async findOneByProperty(id: string, email?: string): Promise<Contract> {
    if (email) {
      // check if user owns the property
      await this.propertiesService.checkUserOwnsProperty(id, email);
    }

    // get contract by property id
    const contract = await this.contractModel.findOne({ property: id }).exec();
    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    email: string,
  ): Promise<Contract> {
    // check if uer owns property related to contract
    const contract = await this.checkUserOwnsRelatedProperty(id, email);

    // update contract
    const updatedContract = await this.contractModel
      .findByIdAndUpdate(contract._id, updateContractDto, { new: true })
      .exec();

    return updatedContract;
  }

  /**
   * @param id Contract id
   * @param email User email
   */
  async remove(id: string, email?: string): Promise<Contract> {
    if (email) {
      // check if uer owns property related to contract
      await this.checkUserOwnsRelatedProperty(id, email);
    }

    // delete contract
    const deletedContract = await this.contractModel
      .findByIdAndDelete(id)
      .exec();

    await this.invoicesService.deleteAllByContract(id);

    return deletedContract;
  }

  async findAll(query?: FilterQuery<Contract>): Promise<Contract[]> {
    const contracts = await this.contractModel.find(query).exec();
    return contracts;
  }

  async findAllByUser(email: string): Promise<Contract[]> {
    const properties = await this.propertiesService.findAll(email);
    const propertiesIds = properties.map((property) => property._id.toString());
    const contracts = await this.contractModel
      .find({ property: { $in: propertiesIds } })
      .populate('property')
      .exec();
    return contracts;
  }

  /**
   * @param id Contract id
   * @param email User email
   */
  async checkUserOwnsRelatedProperty(
    id: string,
    email: string,
  ): Promise<Contract> {
    // get contract
    const contract = await this.contractModel.findById(id).exec();

    // check user owns related property
    await this.propertiesService.checkUserOwnsProperty(
      contract?.property as unknown as string,
      email,
    );

    return contract;
  }
}
