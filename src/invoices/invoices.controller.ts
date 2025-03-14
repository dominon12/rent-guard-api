import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('api/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('issue-monthly')
  issueMonthly() {
    return this.invoicesService.issueMonthly();
  }

  @UseGuards(AuthGuard())
  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser('email') email: string,
  ) {
    return this.invoicesService.create(email, createInvoiceDto);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUser('email') email: string,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto, email);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('email') email: string) {
    return this.invoicesService.delete(id, email);
  }

  @UseGuards(AuthGuard())
  @Get('by-contract/:id')
  findAllByContract(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.invoicesService.findAllByContract(id, email);
  }
}
