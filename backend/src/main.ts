import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
  }); // Ensure this if you're calling from frontend
  await app.listen(3001); // Port must match docker-compose
}
bootstrap();
