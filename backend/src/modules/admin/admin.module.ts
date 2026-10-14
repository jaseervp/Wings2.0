import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Child, ChildSchema } from '../children/schemas/child.schema';
import { AssessmentResponse, AssessmentResponseSchema } from '../assessment/schemas/assessment-response.schema';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { AdminTherapistsController } from './admin-therapists.controller';
import { AdminTherapistsService } from './admin-therapists.service';
import { AdminChildrenController } from './admin-children.controller';
import { AdminChildrenService } from './admin-children.service';
import { AdminAssessmentsController } from './admin-assessments.controller';
import { AdminAssessmentsService } from './admin-assessments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema },
      { name: AssessmentResponse.name, schema: AssessmentResponseSchema },
    ]),
  ],
  controllers: [
    AdminUsersController,
    AdminTherapistsController,
    AdminChildrenController,
    AdminAssessmentsController,
  ],
  providers: [
    AdminUsersService,
    AdminTherapistsService,
    AdminChildrenService,
    AdminAssessmentsService,
  ],
  exports: [
    AdminUsersService,
    AdminTherapistsService,
    AdminChildrenService,
    AdminAssessmentsService,
  ],
})
export class AdminModule {}
