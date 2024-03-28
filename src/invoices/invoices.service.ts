import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Invoice } from './schema/invoice.schema';
import { ContractsService } from 'src/contracts/contracts.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceType } from './types/invoice-type.enum';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { newInvoiceEmail } from 'src/mailing/emails/new-invoice.email';
import { Contract } from 'src/contracts/schema/contract.schema';
import { Property } from 'src/properties/schema/property.schema';
import { User } from 'src/users/schema/user.schema';
import { PropertiesService } from 'src/properties/properties.service';
import { invoicePaidEmail } from 'src/mailing/emails/invoice-paid.email';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private contractsService: ContractsService,
    private mailingService: MailingService,
    private propertiesService: PropertiesService,
  ) {}

  async issueMonthly() {
    // Get the current date
    const date = new Date();

    // Set the date to the 1st of the current month
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // get all contracts
    const contracts = await this.contractsService.findAll();

    // set due date to the 7th day of the current month
    const dueDate = new Date(date.getFullYear(), date.getMonth(), 7);

    // loop over contracts
    for (const contract of contracts) {
      // check if an invoice for rent for
      // the current month has already been issued
      const rentInvoiceInCurrentMonth = await this.invoiceModel
        .findOne({
          contract: contract._id.toString(),
          type: InvoiceType.Rent,
          dueDate: { $gte: currentMonth },
        })
        .exec();

      // if there is no invoice for rent
      // issued in current month,
      // create a new rent invoice
      if (!rentInvoiceInCurrentMonth) {
        const newInvoice = await new this.invoiceModel({
          contract: contract._id.toString(),
          type: InvoiceType.Rent,
          amount: contract.rent,
          wasPaid: false,
          dueDate,
        }).save();
        const property = await this.propertiesService.findOneById(
          contract.property as unknown as string,
        );
        await this.onInvoiceCreated(
          newInvoice,
          contract,
          property,
          property.owner,
        );
      }
    }

    return { success: true };
  }

  async create(
    email: string,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    // check if user owns the property related to contract
    // that invoice will be associated with
    const contract = await this.contractsService.checkUserOwnsRelatedProperty(
      createInvoiceDto.contract,
      email,
    );

    // create invoice
    const invoice = await new this.invoiceModel(createInvoiceDto).save();

    // get property related to contract
    const property = await this.propertiesService.findOneById(
      contract.property as unknown as string,
    );

    await this.onInvoiceCreated(invoice, contract, property, property.owner);

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, email: string) {
    // check if user owns the property related to contract
    // that invoice is associated with
    const contract =
      await this.checkUserOwnsPropertyRelatedToContractAssociatedWithInvoice(
        id,
        email,
      );

    // update
    const invoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto)
      .exec();

    // run on invoice paid effect
    if (!invoice.wasPaid && updateInvoiceDto.wasPaid) {
      const property = await this.propertiesService.findOneById(
        contract.property as unknown as string,
      );
      this.onInvoicePaid(invoice, contract, property, property.owner);
    }

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

  async deleteAllByContract(id: string): Promise<void> {
    await this.invoiceModel
      .deleteMany({
        contract: id,
      })
      .exec();
  }

  async findAllUnpaidExpiredByContract(
    id: string,
    email: string,
  ): Promise<Invoice[]> {
    // check if user owns the property related to contract
    // that invoices are associated with
    await this.contractsService.checkUserOwnsRelatedProperty(id, email);

    // get invoices
    const invoices = await this.invoiceModel
      .find({ contract: id, wasPaid: false, dueDate: { $lte: new Date() } })
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
  ): Promise<Contract> {
    // get invoice
    const invoice = await this.invoiceModel.findById(id).exec();

    // check if user owns the property related to contract
    // that invoice is associated with
    const contract = await this.contractsService.checkUserOwnsRelatedProperty(
      invoice.contract as unknown as string,
      email,
    );

    return contract;
  }

  getInvoiceTypeString(invoice: Invoice) {
    if (invoice.type === InvoiceType.Other && invoice.description) {
      return invoice.description;
    }
    return invoice.type;
  }

  async onInvoiceCreated(
    invoice: Invoice,
    contract: Contract,
    property: Property,
    owner: User,
  ) {
    await this.mailingService.send(
      newInvoiceEmail(contract.tenant.email, {
        fullName: contract.tenant.name,
        invoiceType: this.getInvoiceTypeString(invoice),
        propertyName: property.name,
        invoiceAmount: invoice.amount.toFixed(2),
        ownerName: owner.name,
        dueDate: invoice.dueDate.toLocaleString(),
      }),
    );
  }

  async onInvoicePaid(
    invoice: Invoice,
    contract: Contract,
    property: Property,
    owner: User,
  ) {
    await this.mailingService.send(
      invoicePaidEmail(contract.tenant.email, {
        fullName: contract.tenant.name,
        invoiceType: this.getInvoiceTypeString(invoice),
        propertyName: property.name,
        invoiceAmount: invoice.amount.toFixed(2),
        ownerName: owner.name,
      }),
    );
  }
}
