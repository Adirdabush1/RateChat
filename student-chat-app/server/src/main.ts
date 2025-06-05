import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:5173',
    'https://your-frontend-domain.onrender.com',
  ];

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

  const expressApp = app.getHttpAdapter().getInstance();

  const reactBuildPath = path.join(__dirname, '..', 'client', 'dist'); // או 'build' לפי מצבך

  expressApp.use(express.static(reactBuildPath));

  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
