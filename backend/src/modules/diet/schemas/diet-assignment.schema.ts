import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DietAssignmentDocument = DietAssignment & Document;

@Schema({ timestamps: true })
export class DietAssignment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'DietTemplate', required: true, index: true })
  dietTemplateId: string;

  @Prop({ 
    type: String, 
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'FLAGGED_CONFLICT'], 
    default: 'ACTIVE', 
    index: true 
  })
  status: string;

  @Prop({ type: String, enum: ['MANUAL', 'AUTOMATIC'], default: 'MANUAL' })
  assignmentSource: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedBy?: string;

  @Prop({ default: () => new Date() })
  assignedAt: Date;

  @Prop({ default: false, index: true })
  conflictFlagged: boolean;

  @Prop({ trim: true })
  conflictReason?: string;

  @Prop({ default: false, index: true })
  conflictResolved: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  resolvedBy?: string;

  @Prop()
  resolvedAt?: Date;

  @Prop({ trim: true })
  resolutionNotes?: string;
}

export const DietAssignmentSchema = SchemaFactory.createForClass(DietAssignment);
DietAssignmentSchema.index({ childId: 1, status: 1 });
DietAssignmentSchema.index({ dietTemplateId: 1, status: 1 });
DietAssignmentSchema.index({ conflictFlagged: 1, conflictResolved: 1 });
