import { Email } from '../entities/email.entity';

interface InvoicePaidEmailVariables {
  fullName: string;
  invoiceType: string;
  propertyName: string;
  invoiceAmount: string;
  ownerName: string;
}

export function invoicePaidEmail(
  email: string,
  variables: InvoicePaidEmailVariables,
): Email {
  return new Email('clubjhumc01yhyx9u1s226anl', email, { ...variables });
}
