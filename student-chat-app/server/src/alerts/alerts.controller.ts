import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alert')
export class AlertsController {
  private logger = new Logger('AlertsController');

  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() alert: CreateAlertDto) {
    this.logger.warn(`⚠️ קיבלתם התראה ממערכת הצ'אט`);
    this.logger.log(`סטודנט: ${alert.studentEmail}`);
    this.logger.log(`הודעה: ${alert.message}`);
    this.logger.log(`סיבה: ${alert.reason}`);
    this.logger.log(`צ'אט: ${alert.chatId}`);
    this.logger.log(`תאריך: ${alert.timestamp}`);

    
    return { status: 'ok' };
  }
}
