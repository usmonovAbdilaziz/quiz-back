import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createOwner } from './admins/owner.create';
import { HttpExceptionFilter } from './utils/global-response.error';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await createOwner();
  await app.listen(process.env.PORT! ,() => console.log(`Server is running on port ${process.env.PORT}`));
}
bootstrap();
