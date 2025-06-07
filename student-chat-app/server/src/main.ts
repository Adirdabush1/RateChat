import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // רק דומיין הפרודקשן מותר
  const allowedOrigins = [
    'https://ratechat2.onrender.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // לאפשר בקשות ללא origin (למשל Postman)
      if (!origin) return callback(null, true);
      // לאפשר רק לדומיין הפרודקשן
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
