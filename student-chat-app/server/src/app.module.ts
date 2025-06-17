import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { join } from 'path';

import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlertsService } from './alerts/alerts.service';
import { ParentModule } from './perent/parent.module';
import { ChatModule } from './chat.module';  

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
      // לא כופה envFilePath, כך שברנדור משתמש במשתני סביבה
      // אם תרצה להוסיף קובץ env במקומי תוסיף envFilePath פה
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // אפשר להוסיף אופציות נוספות אם רוצים, לדוגמה:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    ParentModule,
    ChatModule,
  ],
  providers: [AlertsService, MongoConnectionService],
})
export class AppModule {}
