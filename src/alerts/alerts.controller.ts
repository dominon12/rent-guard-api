import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AlertFeed } from './entities/alert-feed.enum';

@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(AuthGuard())
  @Get()
  findAll(@CurrentUser('email') email: string, @Query('type') type: AlertFeed) {
    return this.alertsService.findAll(email, type);
  }
}
