import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PropertiesService } from 'src/properties/properties.service';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private propertiesService: PropertiesService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    email: string,
  ): Promise<Transaction> {
    // check if user owns the property
    await this.propertiesService.checkUserOwnsProperty(
      createTransactionDto.property,
      email,
    );

    // create transaction
    const transaction = await new this.transactionModel(
      createTransactionDto,
    ).save();

    return transaction;
  }

  async findAllByProperty(id: string, email: string): Promise<Transaction[]> {
    // check if user owns the property
    await this.propertiesService.checkUserOwnsProperty(id, email);

    // get transactions by property id
    const transactions = await this.transactionModel
      .find({ property: id })
      .exec();

    return transactions;
  }

  async remove(id: string, email: string): Promise<Transaction> {
    // find property related to transaction
    // and check if user owns it
    const transaction = await this.transactionModel.findById(id).exec();
    await this.propertiesService.checkUserOwnsProperty(
      transaction.property as unknown as string,
      email,
    );

    // query by property id and delete
    const deletedTransaction = await this.transactionModel
      .findByIdAndDelete(transaction._id)
      .exec();

    return deletedTransaction;
  }
}
