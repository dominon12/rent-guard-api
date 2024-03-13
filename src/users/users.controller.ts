import { Controller, Get, Post, Body, UseGuards, Patch } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard())
  @Get('current')
  current(@CurrentUser('email') email: string) {
    return this.usersService.current(email);
  }

  @UseGuards(AuthGuard())
  @Patch('current')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('email') email: string,
  ) {
    return this.usersService.update(email, updateUserDto);
  }
}
