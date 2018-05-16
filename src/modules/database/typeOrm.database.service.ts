import { Component } from '@nestjs/common';
import { HttpException } from '@nestjs/core';
import { createConnection, Connection, EntityManager, Repository, ObjectType, Entity } from 'typeorm';
import { TypeOrmDatabaseConfig } from './typeOrm.database.config';

@Component()
export class TypeOrmDatabaseService {

  private _connection: Connection;

  constructor(private readonly databaseConfig: TypeOrmDatabaseConfig) { }

  private get connection(): Promise<Connection> {
    if (this._connection) return Promise.resolve(this._connection);
    return createConnection(this.databaseConfig.getConfiguration())
    .then((connection: Connection) => {
      this._connection = connection;
      return connection;
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
  }

  public async getEntityManager(): Promise<EntityManager> {
    return (await this.connection).manager;
  }

  public async getRepository<T>(entityClassOrName: ObjectType<T> | string): Promise<Repository<T>> {
    return (await this.connection).getRepository<T>(entityClassOrName);
  }
}
