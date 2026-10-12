import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Child, ChildSchema } from '../children/schemas/child.schema';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { AdminTherapistsController } from './admin-therapists.controller';
import { AdminTherapistsService } from './admin-therapists.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema },
    ]),
  ],
  controllers: [AdminUsersController, AdminTherapistsController],
  providers: [AdminUsersService, AdminTherapistsService],
  exports: [AdminUsersService, AdminTherapistsService],
})
export class AdminModule {}
