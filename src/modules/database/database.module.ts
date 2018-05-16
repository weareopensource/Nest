import { Module, NestModule, SingleScope } from '@nestjs/common';
import { TypeOrmDatabaseService } from './typeOrm.database.service';

@SingleScope()
@Module({
  components: [ TypeOrmDatabaseService ],
  exports: [ TypeOrmDatabaseService ],
})
export class DatabaseModule {}