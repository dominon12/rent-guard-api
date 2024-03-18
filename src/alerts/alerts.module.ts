import { Module } from '@nestjs/common';

import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { ContractsModule } from 'src/contracts/contracts.module';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService],
  imports: [ContractsModule, InvoicesModule],
})
export class AlertsModule {}
