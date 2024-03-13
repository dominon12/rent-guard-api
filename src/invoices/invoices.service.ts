import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Invoice } from './schema/invoice.schema';
import { ContractsService } from 'src/contracts/contracts.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private contractsService: ContractsService,
  ) {}

  async create() {
    // Get the current date
    const date = new Date();

    // Set the date to the 1st of the current month
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // check if there are invoices in this month already created
    const invoiceInThisMonth = await this.invoiceModel
      .findOne({
        createdAt: { $gt: currentMonth },
      })
      .exec();

    if (invoiceInThisMonth) return { success: false };

    // get all contracts
    const contracts = await this.contractsService.findAll();

    // set due date to the 7th day of the current month
    const dueDate = new Date(date.getFullYear(), date.getMonth(), 7);

    // loop over contracts and create a new invoice for each
    for (const contract of contracts) {
      await new this.invoiceModel({
        contract,
        amount: contract.rent,
        wasPaid: false,
        dueDate,
      }).save();
    }

    return { success: true };
  }

  findAllByContract(id: string): Promise<Invoice[]> {
    const invoices = this.invoiceModel.find({ contract: id }).exec();
    return invoices;
  }
}
