import { Injectable } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';

@Injectable()
export class MediaDatabaseConfig extends TypeOrmDatabaseConfig {
  public getConfiguration(): ConnectionOptions {
    return {
      name: 'media',
      type: process.env.DB_DRIVER,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: true,
      logging: true,
    } as ConnectionOptions;
  }
}
