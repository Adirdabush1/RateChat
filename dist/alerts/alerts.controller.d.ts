import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
export declare class AlertsController {
    private readonly alertsService;
    private logger;
    constructor(alertsService: AlertsService);
    create(alert: CreateAlertDto): Promise<{
        status: string;
    }>;
}
