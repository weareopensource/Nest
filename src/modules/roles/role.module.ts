import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { RolesService, Role } from './';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [
    RolesService,
  ],
})
export class RoleModule {
}
