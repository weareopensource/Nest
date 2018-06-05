import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { roleSchema } from './schemas/role.schema';
import { userSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'role', schema: roleSchema },
      { name: 'user', schema: userSchema },
    ]),
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
