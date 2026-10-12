import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AssessmentResponse, AssessmentResponseSchema } from './schemas/assessment-response.schema';
import { ChildrenModule } from '../children/children.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentResponse.name, schema: AssessmentResponseSchema },
    ]),
    ChildrenModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService, MongooseModule],
})
export class AssessmentModule {}
