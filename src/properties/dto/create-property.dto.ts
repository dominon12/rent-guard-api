export class CreatePropertyDto {
  name: string;
  address: {
    address: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  images: string[];
  documents: string[];
  registrationId?: string;
  surface?: string;
  price?: string;
}
