export class CreateContractDto {
  property: string;
  tenant: {
    name: string;
    email: string;
    govId?: string;
  };
  from: Date;
  until: Date;
  rent: number;
  documents: string[];
  deposit?: number;
}
