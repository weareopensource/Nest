import { AuthenticationModule } from '../authentication/authentication.module';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
// import * as csurf from 'csurf';
import { TaskModule } from '../tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from '../configuration';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';

const configuration: any = parse(readFileSync(`${process.cwd()}/src/modules/configuration/defaults/${process.env.NODE_ENV}.env`));

@Module({
  imports: [
    ConfigurationModule,
//    TypeOrmModule.forRoot({
//      type: 'postgres',
//      host: configuration.WAOS_BACK_db_host,
//      port: Number(configuration.WAOS_BACK_db_port),
//      username: configuration.WAOS_BACK_db_username,
//      password: configuration.WAOS_BACK_db_password,
//      database: configuration.WAOS_BACK_db_name,
//      entities: [`${__dirname}/../**/*.entity.ts`],
//      subscribers: [`${__dirname}/../**/*.subscriber.ts`],
//      logging: true,
//      logger: 'debug',
//      synchronize: true,
//    }),
    MongooseModule.forRoot('mongodb://localhost/nestdev'),
    CommonModule,
    UserModule,
    AuthenticationModule,
//    TaskModule,
  ],
})
export class ApplicationModule { }
