import { AuthenticationModule } from '../authentication/authentication.module';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
// import * as csurf from 'csurf';
import { TaskModule } from '../tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [`${__dirname}/../**/*.entity.ts`],
      subscribers: [`${__dirname}/../**/*.subscriber.ts`],
      logging: true,
      logger: 'debug',
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/nestdev'),
    CommonModule,
    UserModule,
    AuthenticationModule,
    TaskModule,
  ],
})
export class ApplicationModule {}
