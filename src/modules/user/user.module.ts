import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserSubscriber } from './entities/user.subscriber';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserByIdPipe,
  ],
  exports: [ UserService ],
})
export class UserModule { }
