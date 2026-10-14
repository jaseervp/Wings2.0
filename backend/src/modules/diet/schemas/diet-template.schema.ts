import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DietTemplateDocument = DietTemplate & Document;

export class MealFoodItem {
  foodId?: string;
  foodName: string;
  portion: string;
  notes?: string;
  allergens?: string[];
}

export class MealSlot {
  name: string; // Breakfast, Morning Snack, Lunch, Evening Snack, Dinner
  time?: string;
  foods: MealFoodItem[];
}

@Schema({ timestamps: true })
export class DietTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: 'General Nutrition', trim: true, index: true })
  category: string; // 'General Nutrition', 'Allergy-Aware', 'Gluten-Free', 'Dairy-Free', 'Low Sugar', 'High Calorie', etc.

  @Prop({ required: true, default: 0, index: true })
  minAge: number; // in years

  @Prop({ required: true, default: 18, index: true })
  maxAge: number; // in years

  @Prop({ default: 'Years' })
  ageUnit: string;

  @Prop({ trim: true })
  ageGroupPreset?: string; // 'Infants', 'Toddlers', 'Preschool', 'School Age', 'Adolescents', 'Custom'

  @Prop({ type: Array, default: [] })
  mealSlots: MealSlot[];

  @Prop({ type: [String], default: [] })
  dietaryRestrictions: string[];

  @Prop({ type: [String], default: [] })
  excludedAllergens: string[];

  @Prop({ type: String, enum: ['MANUAL', 'AUTOMATIC', 'TEMPLATE_ONLY'], default: 'TEMPLATE_ONLY' })
  assignmentMode: string;

  @Prop({ default: false })
  automaticAssignmentEnabled: boolean;

  @Prop({ type: String, enum: ['ACTIVE', 'ARCHIVED', 'DRAFT'], default: 'ACTIVE', index: true })
  status: string;

  @Prop({ default: 'bg-emerald-50' })
  iconBg: string;

  @Prop({ default: 'text-emerald-600' })
  iconColor: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: string;
}

export const DietTemplateSchema = SchemaFactory.createForClass(DietTemplate);
DietTemplateSchema.index({ name: 'text', category: 1 });
DietTemplateSchema.index({ status: 1, minAge: 1, maxAge: 1 });
