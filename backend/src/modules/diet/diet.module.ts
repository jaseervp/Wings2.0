import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DietTemplate, DietTemplateSchema } from './schemas/diet-template.schema';
import { FoodItem, FoodItemSchema } from './schemas/food-item.schema';
import { DietAssignment, DietAssignmentSchema } from './schemas/diet-assignment.schema';
import { Child, ChildSchema } from '../children/schemas/child.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DietTemplate.name, schema: DietTemplateSchema },
      { name: FoodItem.name, schema: FoodItemSchema },
      { name: DietAssignment.name, schema: DietAssignmentSchema },
      { name: Child.name, schema: ChildSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DietController],
  providers: [DietService],
  exports: [DietService],
})
export class DietModule {}
