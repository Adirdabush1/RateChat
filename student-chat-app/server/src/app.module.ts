import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { join } from 'path';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlertsService } from './alerts/alerts.service';
import { ChatGateway } from './chat.gateway';
import { ParentModule } from './perent/parent.module';

@Injectable()
export class MongoConnectionService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.once('open', () => {
      console.log('✅ MongoDB connection established successfully!');
    });

    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'), 
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    UsersModule,
    MessagesModule,
    ParentModule,
  ],
  providers: [ChatGateway, AlertsService, MongoConnectionService],
})
export class AppModule {}
