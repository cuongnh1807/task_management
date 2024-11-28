import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import morgan from 'morgan';
import { GlobalExceptionFilter } from '@/api/filters/GlobalExceptionFilter';
const isApi = Boolean(Number(process.env.IS_API || 0));

const PORT = process.env.PORT || '3000';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (isApi) {
    // const corsOrigin = process.env.CORS_ORIGIN.split(',') || [
    //   'http://localhost:3000',
    // ];
    const globalPrefix = 'api';
    const DEFAULT_API_VERSION = '1';
    app.setGlobalPrefix(globalPrefix);
    app.enableVersioning({
      defaultVersion: DEFAULT_API_VERSION,
      type: VersioningType.URI,
    });

    if (process.env.APP_ENV !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('API docs')
        .setVersion(DEFAULT_API_VERSION)
        .addBearerAuth({ in: 'header', type: 'http' })
        .build();
      const document = SwaggerModule.createDocument(app, config, {});
      SwaggerModule.setup('docs', app, document);
    }

    app.enableCors({
      // allowedHeaders: ['content-type'],
      origin: '*',
      // credentials: true,
    });

    app.use(morgan('tiny'));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter(true, true));
    await app.listen(PORT);
    Logger.log(`🚀 Application is running in port ${PORT}`);
  } else {
    await app.init();
  }
}
bootstrap();
