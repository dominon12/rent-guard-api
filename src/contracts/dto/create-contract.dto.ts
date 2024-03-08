import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateContractDto {
  property: string;
  tenant: CreateUserDto;
  from: Date;
  until: Date;
  rent: number;
  documents: string[];
  deposit?: number;
}
