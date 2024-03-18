import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Invoice } from './schema/invoice.schema';
import { ContractsService } from 'src/contracts/contracts.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private contractsService: ContractsService,
  ) {}

  async issueMonthly() {
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

  async create(
    email: string,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    console.log('create');
    // check if user owns the property related to contract
    // that invoice will be associated with
    await this.contractsService.checkUserOwnsRelatedProperty(
      createInvoiceDto.contract,
      email,
    );

    // create invoice
    const invoice = await new this.invoiceModel(createInvoiceDto).save();

    return invoice;
  }

  async delete(id: string, email: string): Promise<Invoice> {
    // check if user owns the property related to contract
    // that invoice is associated with
    await this.checkUserOwnsPropertyRelatedToContractAssociatedWithInvoice(
      id,
      email,
    );

    // delete invoice
    const invoice = await this.invoiceModel.findByIdAndDelete(id).exec();

    return invoice;
  }

  async findAllByContract(id: string, email: string): Promise<Invoice[]> {
    // check if user owns the property related to contract
    // that invoices are associated with
    await this.contractsService.checkUserOwnsRelatedProperty(id, email);

    // get invoices
    const invoices = await this.invoiceModel
      .find({ contract: id })
      .sort({ dueDate: 'asc' })
      .exec();

    return invoices;
  }

  /**
   * @param id Invoice id
   * @param email User email
   */
  async checkUserOwnsPropertyRelatedToContractAssociatedWithInvoice(
    id: string,
    email: string,
  ) {
    // get invoice
    const invoice = await this.invoiceModel.findById(id).exec();

    // check if user owns the property related to contract
    // that invoice is associated with
    await this.contractsService.checkUserOwnsRelatedProperty(
      invoice.contract as unknown as string,
      email,
    );
  }
}
