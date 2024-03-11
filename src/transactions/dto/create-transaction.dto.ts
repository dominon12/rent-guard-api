import { TransactionType } from '../types/transaction-type.enum';

export class CreateTransactionDto {
  property: string;
  type: TransactionType;
  amount: number;
  description?: string;
}
