import { Injectable } from '@nestjs/common';

import { Alert } from './entities/alert.entity';
import { randomUUID } from 'crypto';
import { InvoicesService } from 'src/invoices/invoices.service';
import { ContractsService } from 'src/contracts/contracts.service';

@Injectable()
export class AlertsService {
  constructor(
    private contractsService: ContractsService,
    private invoicesService: InvoicesService,
  ) {}

  async findAll(email: string): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // get contracts related to user
    const contracts = await this.contractsService.findAllByUser(email);

    // get date 1 month in future from now
    const date = new Date();
    const _1monthFromNow = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    // loop over each contract
    for (const contract of contracts) {
      // find unpaid invoices
      const unpaidInvoices =
        await this.invoicesService.findAllUnpaidExpiredByContract(
          contract._id.toString(),
          email,
        );

      // loop over unpaid invoices
      // creating alerts
      unpaidInvoices.forEach((invoice) => {
        alerts.push({
          id: randomUUID(),
          title: 'Rent has not been paid',
          content: `${contract.tenant.name} should have paid you ${invoice.amount.toFixed(2)}$ until ${invoice.dueDate.toLocaleString()} in the concept of Rent for ${contract.property.name}.`,
        });
      });

      // in case contract finishes soon,
      // add an alert
      if (contract.until < _1monthFromNow) {
        alerts.push({
          id: randomUUID(),
          title: 'Contract finishes soon',
          content: `Your contract with ${contract.tenant.name} in ${contract.property.name} finishes in less than 1 month.`,
        });
      }
    }

    return alerts;
  }
}
