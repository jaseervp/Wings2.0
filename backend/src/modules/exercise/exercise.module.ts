import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Exercise, ExerciseSchema } from './schemas/exercise.schema';
import { ExerciseCategory, ExerciseCategorySchema } from './schemas/exercise-category.schema';
import { ChildActivityPlan, ChildActivityPlanSchema } from './schemas/child-activity-plan.schema';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { ExerciseAssignmentRule, ExerciseAssignmentRuleSchema } from './schemas/exercise-assignment-rule.schema';
import { TherapistFeedback, TherapistFeedbackSchema } from './schemas/therapist-feedback.schema';
import { SkillProgress, SkillProgressSchema } from './schemas/skill-progress.schema';
import {
  ExerciseProgramTemplate,
  ExerciseProgramTemplateSchema,
} from './schemas/exercise-program-template.schema';

import { Child, ChildSchema } from '../children/schemas/child.schema';
import { AssessmentResponse, AssessmentResponseSchema } from '../assessment/schemas/assessment-response.schema';

import { ExerciseService } from './exercise.service';
import { ExerciseVideoService } from './services/exercise-video.service';
import { ExerciseAssignmentService } from './services/exercise-assignment.service';
import { ExerciseProgressService } from './services/exercise-progress.service';
import { ExerciseTemplateService } from './services/exercise-template.service';

import { AdminExerciseController } from './admin-exercise.controller';
import { ExerciseController } from './exercise.controller';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: ExerciseCategory.name, schema: ExerciseCategorySchema },
      { name: ChildActivityPlan.name, schema: ChildActivityPlanSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: ExerciseAssignmentRule.name, schema: ExerciseAssignmentRuleSchema },
      { name: TherapistFeedback.name, schema: TherapistFeedbackSchema },
      { name: SkillProgress.name, schema: SkillProgressSchema },
      { name: ExerciseProgramTemplate.name, schema: ExerciseProgramTemplateSchema },
      { name: Child.name, schema: ChildSchema },
      { name: AssessmentResponse.name, schema: AssessmentResponseSchema },
    ]),
  ],
  controllers: [AdminExerciseController, ExerciseController],
  providers: [
    ExerciseService,
    ExerciseVideoService,
    ExerciseAssignmentService,
    ExerciseProgressService,
    ExerciseTemplateService,
  ],
  exports: [
    ExerciseService,
    ExerciseVideoService,
    ExerciseAssignmentService,
    ExerciseProgressService,
    ExerciseTemplateService,
  ],
})
export class ExerciseModule {}
