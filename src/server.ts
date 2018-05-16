import { HttpExceptionFilter, ErrorExceptionFilter } from './modules/common/filters';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './modules/application/application.module';
import { ValidationPipe } from './modules/common/pipes/validation.pipe';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../certs/key.pem'),
    cert: fs.readFileSync('../certs/cert.pem'),
  };
  const corsOptions = {
    origin: ['http://localhost:4200', 'https://localhost:4200'],
    optionsSuccessStatus: 200,
    credentials: true,
  };
  const expressInstance = express();
  expressInstance.disable('x-powered-by');
  expressInstance.use(helmet());
  expressInstance.use(cors(corsOptions));
  expressInstance.use(bodyParser.json({limit: '50mb'}));
  expressInstance.use(cookieParser());

//  const app2 = await NestFactory.create(ApplicationModule);
//  await app2.listen(3001);

  const app = await NestFactory.create(ApplicationModule, expressInstance);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new ErrorExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Prothesist')
    .setDescription('The prothesist API description')
    .setVersion('1.0')
    .setSchemes('https')
    .addTag('authentication')
    .addTag('users')
    .addTag('roles')
    .addTag('commands')
    .addTag('medias')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  await https.createServer(httpsOptions, expressInstance).listen(3000);
  app.init();
}
bootstrap();
