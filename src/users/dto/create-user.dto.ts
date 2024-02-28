import { Role } from '../types/role.enum';

export class CreateUserDto {
  name: string;
  email: string;
  role: Role;
}
