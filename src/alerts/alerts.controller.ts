import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alert')
export class AlertsController {
  private logger = new Logger('AlertsController');

  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() alert: CreateAlertDto) {
    this.logger.warn(`⚠️ You received an alert from the chat system`);
    this.logger.log(`Student: ${alert.studentEmail}`);
    this.logger.log(`Message: ${alert.message}`);
    this.logger.log(`Reason: ${alert.reason}`);
    this.logger.log(`Chat ID: ${alert.chatId}`);
    this.logger.log(`Timestamp: ${alert.timestamp}`);

    return { status: 'ok' };
  }
}
