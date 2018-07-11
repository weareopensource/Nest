import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schemas/role.schema';
import { UserSchema } from './schemas/user.schema';
// import * as ac from 'accesscontrol';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'role', schema: RoleSchema },
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserByIdPipe,
//    UserSchemaProvider,
//    {
//      provide: 'AccessControl',
//      useClass: ac.AccessControl,
//    },
  ],
  exports: [ UserService ],
})
export class UserModule { }
