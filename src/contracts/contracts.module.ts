import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PropertiesModule } from 'src/properties/properties.module';
import { Contract, ContractSchema } from './schema/contract.schema';
import { InvoicesModule } from 'src/invoices/invoices.module';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    PropertiesModule,
    forwardRef(() => InvoicesModule),
  ],
  exports: [ContractsService],
})
export class ContractsModule {}
