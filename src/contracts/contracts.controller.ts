import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(AuthGuard())
  @Post()
  create(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser('email') email: string,
  ) {
    return this.contractsService.create(createContractDto, email);
  }

  @UseGuards(AuthGuard())
  @Get('by-property/:id')
  findOneByProperty(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.contractsService.findOneByProperty(id, email);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @CurrentUser('email') email: string,
  ) {
    return this.contractsService.update(id, updateContractDto, email);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('email') email: string) {
    return this.contractsService.remove(id, email);
  }
}
