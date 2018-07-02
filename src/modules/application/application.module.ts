import { AuthenticationModule } from '../authentication/authentication.module';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
// import * as csurf from 'csurf';
import { TaskModule } from '../tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule, ConfigurationService } from '../configuration';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.WAOS_BACK_db_host,
      port: Number(process.env.WAOS_BACK_db_port),
      username: process.env.WAOS_BACK_db_username,
      password: process.env.WAOS_BACK_db_password,
      database: process.env.WAOS_BACK_db_name,
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
export class ApplicationModule { }
