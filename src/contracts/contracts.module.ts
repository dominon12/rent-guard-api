import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { Contract, ContractSchema } from './schema/contract.schema';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    UsersModule,
    PropertiesModule,
  ],
  exports: [ContractsService],
})
export class ContractsModule {}
