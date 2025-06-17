import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = ['https://ratechat-f72a4557d4ab.herokuapp.com'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // הפעלת ולידציה גלובלית
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // מסיר שדות לא מוגדרים ב-DTO
    forbidNonWhitelisted: true, // מחזיר שגיאה אם יש שדות לא מורשים
    transform: true,          // ממיר אוטומטית את הנתונים לסוגי ה-DTO
  }));

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Application is running on port ${port}`);
}
bootstrap();
