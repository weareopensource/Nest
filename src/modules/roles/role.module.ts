import { Module, NestModule, RequestMethod, MiddlewaresConsumer, OnModuleInit } from '@nestjs/common';
import { RolesController, RolesService } from '../roles';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmDatabaseConfig } from '../database/typeOrm.database.config';
import { RoleDatabaseConfig } from './role.database.config';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  modules: [ DatabaseModule ],
  controllers: [
    RolesController,
  ],
  components: [
    RolesService,
    { provide: TypeOrmDatabaseConfig, useClass: RoleDatabaseConfig },
  ],
})
export class RoleModule {
}
