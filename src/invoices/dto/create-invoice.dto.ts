import { InvoiceType } from '../types/invoice-type.enum';

export class CreateInvoiceDto {
  contract: string;
  type: InvoiceType;
  amount: number;
  dueDate: Date;
  description?: string;
}
