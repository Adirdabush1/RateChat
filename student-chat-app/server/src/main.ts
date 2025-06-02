import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ הפעלת CORS
  app.enableCors({
    origin: 'http://localhost:5173', // ה־Frontend שלך
    credentials: true, // אם אתה שולח cookies או headers מיוחדים
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
