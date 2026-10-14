import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FoodItemDocument = FoodItem & Document;

@Schema({ timestamps: true })
export class FoodItem {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ default: 'General', trim: true })
  category: string; // 'Grains', 'Proteins', 'Dairy & Alternatives', 'Fruits & Vegetables', 'Snacks', etc.

  @Prop({ type: [String], default: [] })
  allergens: string[]; // e.g. ['Dairy', 'Gluten', 'Peanuts', 'Nuts', 'Eggs', 'Soy', 'Seafood', 'Dust']

  @Prop({ trim: true })
  ingredients?: string;

  @Prop({ default: 'serving' })
  servingUnit: string;

  @Prop({ type: Object, default: {} })
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };

  @Prop({ type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true })
  status: string;
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);
FoodItemSchema.index({ name: 'text', category: 1 });
