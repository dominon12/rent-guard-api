export class CreatePropertyDto {
  name: string;
  address: string;
  images: string[];
  documents: string[];
  city?: string;
  postalCode?: string;
  country?: string;
  registrationId?: string;
  surface?: string;
  price?: string;
}
