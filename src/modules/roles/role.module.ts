import { Module, NestModule, RequestMethod, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { RolesController, RolesService, Role } from './';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
  ],
  controllers: [
    RolesController,
  ],
  providers: [
    RolesService,
  ],
})
export class RoleModule {
}
