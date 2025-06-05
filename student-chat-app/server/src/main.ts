import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // אפשר CORS למספר מקורות - מקומי ופרודקשן
  const allowedOrigins = [
    'http://localhost:5173',           // לפיתוח מקומי
    'https://ratechat2.onrender.com',  // כתובת הפרונט ב-Render
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // אם origin הוא undefined (לדוגמה בקשות משרתים), אפשר להמשיך
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
