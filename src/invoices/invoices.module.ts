import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './schema/invoice.schema';
import { ContractsModule } from 'src/contracts/contracts.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ContractsModule,
    MailingModule,
    PropertiesModule,
  ],
  exports: [InvoicesService],
})
export class InvoicesModule {}
