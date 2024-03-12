import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard())
  @Get('by-property/:id/balance')
  getBalanceByProperty(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.transactionsService.getBalanceByProperty(id, email);
  }

  @UseGuards(AuthGuard())
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.transactionsService.create(createTransactionDto, email);
  }

  @UseGuards(AuthGuard())
  @Get('by-property/:id')
  findAllByProperty(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.transactionsService.findAllByProperty(id, email);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('email') email: string) {
    return this.transactionsService.remove(id, email);
  }
}
