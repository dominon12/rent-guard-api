import { Email } from '../entities/email.entity';

interface NewInvoiceEmailVariables {
  fullName: string;
  invoiceType: string;
  propertyName: string;
  invoiceAmount: string;
  ownerName: string;
  dueDate: string;
}

export function newInvoiceEmail(
  email: string,
  variables: NewInvoiceEmailVariables,
): Email {
  return new Email('clubi6xab01ryr8x9wl1cxt1c', email, { ...variables });
}
