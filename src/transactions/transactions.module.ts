import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PropertiesModule,
  ],
})
export class TransactionsModule {}
