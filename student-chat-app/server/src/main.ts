import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'https://ratechat-f72a4557d4ab.herokuapp.com',
    'https://ratechat-front.herokuapp.com',
    'http://localhost:3000', 
  ];

  app.enableCors({
  origin: 'https://ratechat-front-d89b15939b57.herokuapp.com', 
  credentials: true,
});


  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Application is running on port ${port}`);
}
bootstrap();
