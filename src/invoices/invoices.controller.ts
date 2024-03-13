import { Controller, Post } from '@nestjs/common';

import { InvoicesService } from './invoices.service';

@Controller('api/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create() {
    return this.invoicesService.create();
  }
}
