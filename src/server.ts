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

(async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
  };
  const corsOptions = {
    origin: ['http://localhost:4200', 'https://localhost:4200'],
    optionsSuccessStatus: 200,
    credentials: true,
  };
  const expressInstance = express();

//  const app2 = await NestFactory.create(ApplicationModule);
//  await app2.listen(3001);

  const app = await NestFactory.create(ApplicationModule, expressInstance);
  app.setGlobalPrefix('/api');
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new ErrorExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('meanie')
    .setDescription('The meanie API description')
    .setVersion('1.0')
    .setSchemes('https')
    .addTag('authentication')
    .addTag('users')
    .addTag('tasks')
    .addTag('medias')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);
  app.init();

//  await https.createServer(httpsOptions, expressInstance).listen(3000);
  await http.createServer(expressInstance).listen(3000);

})();
