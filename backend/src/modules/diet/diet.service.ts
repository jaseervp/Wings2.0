import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DietTemplate, DietTemplateDocument } from './schemas/diet-template.schema';
import { FoodItem, FoodItemDocument } from './schemas/food-item.schema';
import { DietAssignment, DietAssignmentDocument } from './schemas/diet-assignment.schema';
import { Child, ChildDocument } from '../children/schemas/child.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateDietTemplateDto } from './dto/create-diet-template.dto';
import { UpdateDietTemplateDto } from './dto/update-diet-template.dto';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { ManualAssignDietDto, ConfirmAutoAssignDto } from './dto/assign-diet.dto';
import { ResolveConflictDto } from './dto/resolve-conflict.dto';

@Injectable()
export class DietService implements OnModuleInit {
  constructor(
    @InjectModel(DietTemplate.name)
    private readonly templateModel: Model<DietTemplateDocument>,
    @InjectModel(FoodItem.name)
    private readonly foodModel: Model<FoodItemDocument>,
    @InjectModel(DietAssignment.name)
    private readonly assignmentModel: Model<DietAssignmentDocument>,
    @InjectModel(Child.name)
    private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.seedInitialBaselineData();
  }

  private async seedInitialBaselineData() {
    // 1. Seed food items if empty
    const foodCount = await this.foodModel.countDocuments();
    if (foodCount === 0) {
      const initialFoods = [
        { name: 'Oatmeal', category: 'Grains', allergens: ['Gluten'], servingUnit: '1 cup', nutrition: { calories: 150, protein: 5, carbs: 27, fats: 3 } },
        { name: 'Almond Milk', category: 'Dairy & Alternatives', allergens: ['Nuts'], servingUnit: '200 ml', nutrition: { calories: 60, protein: 1, carbs: 8, fats: 3 } },
        { name: 'Boiled Eggs', category: 'Proteins', allergens: ['Eggs'], servingUnit: '2 eggs', nutrition: { calories: 140, protein: 12, carbs: 1, fats: 10 } },
        { name: 'Greek Yogurt', category: 'Dairy & Alternatives', allergens: ['Dairy'], servingUnit: '150 g', nutrition: { calories: 130, protein: 15, carbs: 6, fats: 4 } },
        { name: 'Steamed Broccoli', category: 'Fruits & Vegetables', allergens: [], servingUnit: '100 g', nutrition: { calories: 35, protein: 3, carbs: 7, fats: 0 } },
        { name: 'Sweet Potato Mash', category: 'Fruits & Vegetables', allergens: [], servingUnit: '150 g', nutrition: { calories: 130, protein: 2, carbs: 30, fats: 0 } },
        { name: 'Grilled Chicken Breast', category: 'Proteins', allergens: [], servingUnit: '120 g', nutrition: { calories: 165, protein: 31, carbs: 0, fats: 4 } },
        { name: 'Apple Slices', category: 'Fruits & Vegetables', allergens: [], servingUnit: '1 medium', nutrition: { calories: 80, protein: 0, carbs: 21, fats: 0 } },
        { name: 'Brown Rice', category: 'Grains', allergens: [], servingUnit: '1 cup', nutrition: { calories: 215, protein: 5, carbs: 45, fats: 2 } },
        { name: 'Peanut Butter Toast', category: 'Snacks', allergens: ['Peanuts', 'Gluten'], servingUnit: '1 slice', nutrition: { calories: 190, protein: 7, carbs: 18, fats: 10 } },
        { name: 'Lentil Soup', category: 'Proteins', allergens: [], servingUnit: '1 bowl', nutrition: { calories: 180, protein: 12, carbs: 30, fats: 2 } },
      ];
      await this.foodModel.insertMany(initialFoods);
    }

    // 2. Seed diet templates matching reference UI if empty
    const templateCount = await this.templateModel.countDocuments();
    if (templateCount === 0) {
      const initialTemplates = [
        {
          name: 'Standard Auto-Immune Protocol',
          description: 'Anti-inflammatory protocol focusing on gut healing and sensory-friendly texture variations.',
          category: 'Allergy-Aware',
          minAge: 3,
          maxAge: 6,
          ageGroupPreset: 'Preschool',
          mealSlots: [
            { name: 'Breakfast', foods: [{ foodName: 'Oatmeal', portion: '1 cup', allergens: ['Gluten'] }, { foodName: 'Apple Slices', portion: '1 medium', allergens: [] }] },
            { name: 'Morning Snack', foods: [{ foodName: 'Almond Milk', portion: '150 ml', allergens: ['Nuts'] }] },
            { name: 'Lunch', foods: [{ foodName: 'Grilled Chicken Breast', portion: '100 g', allergens: [] }, { foodName: 'Sweet Potato Mash', portion: '100 g', allergens: [] }] },
            { name: 'Dinner', foods: [{ foodName: 'Lentil Soup', portion: '1 bowl', allergens: [] }, { foodName: 'Steamed Broccoli', portion: '80 g', allergens: [] }] },
          ],
          dietaryRestrictions: ['Nightshade-Free', 'Preservative-Free'],
          excludedAllergens: ['Dairy', 'Soy', 'Artificial Colors'],
          assignmentMode: 'TEMPLATE_ONLY',
          status: 'ACTIVE',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
        },
        {
          name: 'Gluten-Free & Dairy-Free Basic',
          description: 'Gentle core developmental diet strictly excluding dairy lactalbumin and gluten proteins.',
          category: 'Gluten-Free',
          minAge: 0,
          maxAge: 2,
          ageGroupPreset: 'Infants & Toddlers',
          mealSlots: [
            { name: 'Breakfast', foods: [{ foodName: 'Sweet Potato Mash', portion: '80 g', allergens: [] }] },
            { name: 'Morning Snack', foods: [{ foodName: 'Apple Slices', portion: '1/2 apple', allergens: [] }] },
            { name: 'Lunch', foods: [{ foodName: 'Lentil Soup', portion: '1/2 bowl', allergens: [] }] },
            { name: 'Evening Snack', foods: [{ foodName: 'Steamed Broccoli', portion: '50 g', allergens: [] }] },
            { name: 'Dinner', foods: [{ foodName: 'Brown Rice', portion: '1/2 cup', allergens: [] }] },
          ],
          dietaryRestrictions: ['Celiac-Safe', 'Lactose-Free'],
          excludedAllergens: ['Gluten', 'Dairy'],
          assignmentMode: 'TEMPLATE_ONLY',
          status: 'ACTIVE',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
        },
        {
          name: 'High Calorie Weight Gain',
          description: 'Calorically dense nutrient-rich profile designed to support healthy physical developmental growth.',
          category: 'High Calorie',
          minAge: 3,
          maxAge: 6,
          ageGroupPreset: 'Preschool',
          mealSlots: [
            { name: 'Breakfast', foods: [{ foodName: 'Greek Yogurt', portion: '150 g', allergens: ['Dairy'] }, { foodName: 'Boiled Eggs', portion: '2 eggs', allergens: ['Eggs'] }] },
            { name: 'Morning Snack', foods: [{ foodName: 'Peanut Butter Toast', portion: '1 slice', allergens: ['Peanuts', 'Gluten'] }] },
            { name: 'Lunch', foods: [{ foodName: 'Grilled Chicken Breast', portion: '120 g', allergens: [] }, { foodName: 'Brown Rice', portion: '1 cup', allergens: [] }] },
            { name: 'Dinner', foods: [{ foodName: 'Sweet Potato Mash', portion: '150 g', allergens: [] }] },
          ],
          dietaryRestrictions: ['High Protein', 'Healthy Fats'],
          excludedAllergens: [],
          assignmentMode: 'TEMPLATE_ONLY',
          status: 'ACTIVE',
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
        },
        {
          name: 'Low Sugar Focus',
          description: 'Regulated glycemic index diet formulated to assist hyperactivity balance and focus stability.',
          category: 'Low Sugar',
          minAge: 7,
          maxAge: 12,
          ageGroupPreset: 'School Age',
          mealSlots: [
            { name: 'Breakfast', foods: [{ foodName: 'Boiled Eggs', portion: '2 eggs', allergens: ['Eggs'] }, { foodName: 'Steamed Broccoli', portion: '80 g', allergens: [] }] },
            { name: 'Lunch', foods: [{ foodName: 'Grilled Chicken Breast', portion: '120 g', allergens: [] }, { foodName: 'Brown Rice', portion: '1 cup', allergens: [] }] },
            { name: 'Dinner', foods: [{ foodName: 'Lentil Soup', portion: '1 bowl', allergens: [] }] },
          ],
          dietaryRestrictions: ['Sugar-Free', 'Low Glycemic'],
          excludedAllergens: ['Refined Sugars'],
          assignmentMode: 'TEMPLATE_ONLY',
          status: 'ACTIVE',
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
        },
      ];
      await this.templateModel.insertMany(initialTemplates);
    }
  }

  // --- TEMPLATES ---

  async getTemplates(search?: string, category?: string, status?: string) {
    const match: any = {};
    if (status && status !== 'ALL') {
      match.status = status;
    } else {
      match.status = { $ne: 'ARCHIVED' };
    }

    if (category && category !== 'ALL') {
      match.category = category;
    }

    if (search && search.trim()) {
      const reg = new RegExp(search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      match.$or = [{ name: reg }, { description: reg }, { category: reg }];
    }

    const templates = await this.templateModel.find(match).sort({ createdAt: -1 }).lean().exec();

    // Calculate real assigned child count per template
    const templateIds = templates.map((t) => t._id);
    const assignmentCounts = await this.assignmentModel.aggregate([
      {
        $match: {
          dietTemplateId: { $in: templateIds },
          status: 'ACTIVE',
        },
      },
      {
        $group: {
          _id: '$dietTemplateId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap: Record<string, number> = {};
    assignmentCounts.forEach((ac) => {
      countMap[ac._id.toString()] = ac.count;
    });

    return templates.map((t) => {
      const idStr = t._id.toString();
      const mealsCount = Array.isArray(t.mealSlots) ? t.mealSlots.length : 0;
      return {
        id: idStr,
        _id: idStr,
        name: t.name,
        description: t.description || '',
        category: t.category,
        minAge: t.minAge,
        maxAge: t.maxAge,
        ageUnit: t.ageUnit || 'Years',
        age: `${t.minAge} - ${t.maxAge} ${t.ageUnit || 'Years'}`,
        ageGroupPreset: t.ageGroupPreset,
        meals: mealsCount,
        mealSlots: t.mealSlots || [],
        dietaryRestrictions: t.dietaryRestrictions || [],
        excludedAllergens: t.excludedAllergens || [],
        assigned: countMap[idStr] || 0,
        assignmentMode: t.assignmentMode,
        status: t.status,
        iconBg: t.iconBg || 'bg-emerald-50',
        iconColor: t.iconColor || 'text-emerald-600',
        createdAt: (t as any).createdAt,
      };
    });
  }

  async getTemplate(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid template ID');
    const template: any = await this.templateModel.findById(id).lean().exec();
    if (!template) throw new NotFoundException('Diet template not found');

    const activeAssignments = await this.assignmentModel.countDocuments({
      dietTemplateId: template._id,
      status: 'ACTIVE',
    });

    return {
      ...template,
      id: template._id.toString(),
      assigned: activeAssignments,
    };
  }

  async createTemplate(adminId: string, dto: CreateDietTemplateDto) {
    if (dto.minAge > dto.maxAge) {
      throw new BadRequestException('Minimum age cannot be greater than maximum age');
    }

    const created = new this.templateModel({
      ...dto,
      createdBy: adminId,
    });
    const saved = await created.save();

    // If manual children were selected on creation
    if (dto.selectedChildIds && dto.selectedChildIds.length > 0) {
      await this.manualAssign(adminId, {
        dietTemplateId: saved._id.toString(),
        childIds: dto.selectedChildIds,
      });
    }

    return this.getTemplate(saved._id.toString());
  }

  async updateTemplate(adminId: string, id: string, dto: UpdateDietTemplateDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid template ID');
    if (dto.minAge !== undefined && dto.maxAge !== undefined && dto.minAge > dto.maxAge) {
      throw new BadRequestException('Minimum age cannot be greater than maximum age');
    }

    const updated = await this.templateModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!updated) throw new NotFoundException('Diet template not found');
    return this.getTemplate(updated._id.toString());
  }

  async archiveTemplate(adminId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid template ID');
    const template = await this.templateModel.findByIdAndUpdate(
      id,
      { $set: { status: 'ARCHIVED' } },
      { new: true },
    );
    if (!template) throw new NotFoundException('Diet template not found');
    return { success: true, message: 'Template archived successfully' };
  }

  // --- FOOD DATABASE ---

  async getFoods(search?: string, category?: string, status?: string) {
    const match: any = {};
    if (status && status !== 'ALL') match.status = status;
    if (category && category !== 'ALL') match.category = category;
    if (search && search.trim()) {
      match.name = new RegExp(search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    }
    const foods = await this.foodModel.find(match).sort({ name: 1 }).lean().exec();
    return foods.map((f) => ({
      ...f,
      id: f._id.toString(),
    }));
  }

  async createFood(dto: CreateFoodItemDto) {
    const existing = await this.foodModel.findOne({ name: new RegExp(`^${dto.name.trim()}$`, 'i') });
    if (existing) {
      throw new BadRequestException(`Food item "${dto.name}" already exists`);
    }
    const food = new this.foodModel(dto);
    const saved = await food.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  async updateFood(id: string, dto: UpdateFoodItemDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid food item ID');
    const updated = await this.foodModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!updated) throw new NotFoundException('Food item not found');
    return { ...updated.toObject(), id: updated._id.toString() };
  }

  async deleteFood(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid food item ID');
    await this.foodModel.findByIdAndUpdate(id, { $set: { status: 'INACTIVE' } });
    return { success: true };
  }

  // --- ALLERGY CONFLICT ENGINE ---

  public calculateChildAgeInYears(dob: Date): number {
    const diffMs = Date.now() - new Date(dob).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25)));
  }

  public detectAllergyConflict(child: any, template: any): { hasConflict: boolean; reason?: string; allergen?: string } {
    if (!child || !template) return { hasConflict: false };
    const rawAllergies = (child.allergies || '').trim().toLowerCase();
    if (!rawAllergies || rawAllergies === 'none' || rawAllergies === 'nil') {
      return { hasConflict: false };
    }

    // Split child allergies into normalized keywords
    const childAllergyTokens = rawAllergies
      .split(/[,;\n/]+/)
      .map((t: string) => t.trim().toLowerCase())
      .filter((t: string) => t.length > 0);

    // Collect all allergens and food names from template meal slots
    const templateAllergenTokens: string[] = [];
    (template.mealSlots || []).forEach((slot: any) => {
      (slot.foods || []).forEach((food: any) => {
        if (Array.isArray(food.allergens)) {
          food.allergens.forEach((a: string) => templateAllergenTokens.push(a.toLowerCase()));
        }
        if (food.foodName) {
          templateAllergenTokens.push(food.foodName.toLowerCase());
        }
      });
    });

    // Check intersection
    for (const cAllergy of childAllergyTokens) {
      for (const tToken of templateAllergenTokens) {
        if (tToken.includes(cAllergy) || cAllergy.includes(tToken)) {
          return {
            hasConflict: true,
            allergen: cAllergy.toUpperCase(),
            reason: `Child has documented allergy "${cAllergy.toUpperCase()}" which is present in meal plan "${template.name}".`,
          };
        }
      }
    }

    return { hasConflict: false };
  }

  // --- CHILD SELECTION & ASSIGNMENT ---

  async getEligibleChildren(templateId: string, search?: string) {
    const template: any = await this.templateModel.findById(templateId).lean().exec();
    if (!template) throw new NotFoundException('Diet template not found');

    const match: any = { status: { $ne: 'DELETED' } };
    if (search && search.trim()) {
      const reg = new RegExp(search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      match.$or = [{ firstName: reg }, { lastName: reg }, { preferredName: reg }];
    }

    const children = await this.childModel.find(match).lean().exec();
    const parentIds = children.map((c) => c.parentId).filter(Boolean);
    const parents = await this.userModel.find({ _id: { $in: parentIds } }).select('fullName email phone').lean().exec();
    const parentMap = new Map(parents.map((p) => [p._id.toString(), p]));

    // Active assignments map
    const activeAssignments = await this.assignmentModel
      .find({ childId: { $in: children.map((c) => c._id) as any }, status: 'ACTIVE' })
      .populate('dietTemplateId', 'name')
      .lean()
      .exec();
    const assignmentMap = new Map(activeAssignments.map((a) => [a.childId.toString(), a]));

    return children.map((c) => {
      const ageYears = this.calculateChildAgeInYears(c.dateOfBirth);
      const isAgeMatch = ageYears >= template.minAge && ageYears <= template.maxAge;
      const conflictCheck = this.detectAllergyConflict(c, template);
      const existingAssign: any = assignmentMap.get(c._id.toString());
      const parent: any = parentMap.get(c.parentId?.toString());

      let eligibilityStatus = 'ELIGIBLE';
      let eligibilityReason = 'Meets age criteria and has no documented allergy conflicts.';

      if (conflictCheck.hasConflict) {
        eligibilityStatus = 'ALLERGY_CONFLICT';
        eligibilityReason = conflictCheck.reason || 'Allergy conflict detected.';
      } else if (!isAgeMatch) {
        eligibilityStatus = 'OUTSIDE_AGE_RANGE';
        eligibilityReason = `Child is ${ageYears} years old; template targets ${template.minAge}-${template.maxAge} years.`;
      } else if (existingAssign) {
        eligibilityStatus = 'ALREADY_ASSIGNED';
        eligibilityReason = `Currently assigned to "${existingAssign.dietTemplateId?.name || 'Diet'}".`;
      }

      return {
        id: c._id.toString(),
        name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.preferredName || 'Child',
        age: `${ageYears} yrs`,
        ageYears,
        gender: c.gender,
        dateOfBirth: c.dateOfBirth,
        allergies: c.allergies || 'None',
        medicalConditions: c.medicalConditions || 'None',
        parentName: parent?.fullName || 'Unassigned Parent',
        parentEmail: parent?.email || null,
        currentDiet: existingAssign ? existingAssign.dietTemplateId?.name : null,
        eligibilityStatus,
        eligibilityReason,
        isEligible: eligibilityStatus === 'ELIGIBLE',
      };
    });
  }

  async manualAssign(adminId: string, dto: ManualAssignDietDto) {
    const template: any = await this.templateModel.findById(dto.dietTemplateId).lean().exec();
    if (!template) throw new NotFoundException('Diet template not found');

    const children = await this.childModel.find({ _id: { $in: dto.childIds } }).lean().exec();
    const results: any[] = [];

    for (const child of children) {
      const conflictCheck = this.detectAllergyConflict(child, template);
      const isConflict = conflictCheck.hasConflict;

      // Deactivate any existing active assignments for this child
      await this.assignmentModel.updateMany(
        { childId: child._id as any, status: 'ACTIVE' },
        { $set: { status: 'COMPLETED' } },
      );

      const assignment = new this.assignmentModel({
        childId: child._id,
        dietTemplateId: template._id,
        status: isConflict && !dto.overrideConflicts ? 'FLAGGED_CONFLICT' : 'ACTIVE',
        assignmentSource: 'MANUAL',
        assignedBy: adminId,
        assignedAt: new Date(),
        conflictFlagged: isConflict,
        conflictReason: isConflict ? conflictCheck.reason : undefined,
        conflictResolved: isConflict && dto.overrideConflicts,
        resolvedBy: isConflict && dto.overrideConflicts ? adminId : undefined,
        resolvedAt: isConflict && dto.overrideConflicts ? new Date() : undefined,
        resolutionNotes: isConflict && dto.overrideConflicts ? 'Manual clinical override by administrator' : undefined,
      });

      const saved = await assignment.save();
      results.push({
        childId: child._id.toString(),
        childName: `${child.firstName} ${child.lastName}`.trim(),
        status: saved.status,
        conflictFlagged: saved.conflictFlagged,
      });
    }

    return {
      success: true,
      assignedCount: results.filter((r: any) => r.status === 'ACTIVE').length,
      flaggedCount: results.filter((r: any) => r.status === 'FLAGGED_CONFLICT').length,
      assignments: results,
    };

  }

  // --- AUTOMATIC ASSIGNMENT ENGINE ---

  async previewAutoAssign(templateId: string) {
    const template: any = await this.templateModel.findById(templateId).lean().exec();
    if (!template) throw new NotFoundException('Diet template not found');

    const children = await this.childModel.find({ status: { $ne: 'DELETED' } }).lean().exec();

    const eligible: any[] = [];
    const excluded: any[] = [];
    const conflicts: any[] = [];
    const alreadyAssigned: any[] = [];

    const activeAssignments = await this.assignmentModel
      .find({ status: 'ACTIVE' })
      .populate('dietTemplateId', 'name')
      .lean()
      .exec();
    const assignmentMap = new Map(activeAssignments.map((a) => [a.childId.toString(), a]));

    for (const c of children) {
      const age = this.calculateChildAgeInYears(c.dateOfBirth);
      const inAgeRange = age >= template.minAge && age <= template.maxAge;
      const conflictCheck = this.detectAllergyConflict(c, template);
      const existing: any = assignmentMap.get(c._id.toString());

      const item = {
        id: c._id.toString(),
        name: `${c.firstName} ${c.lastName}`.trim(),
        age: `${age} yrs`,
        allergies: c.allergies || 'None',
      };

      if (conflictCheck.hasConflict) {
        conflicts.push({ ...item, reason: conflictCheck.reason });
      } else if (!inAgeRange) {
        excluded.push({ ...item, reason: `Age ${age} outside target range (${template.minAge}-${template.maxAge})` });
      } else if (existing) {
        alreadyAssigned.push({ ...item, currentDiet: existing.dietTemplateId?.name });
      } else {
        eligible.push(item);
      }
    }

    return {
      templateName: template.name,
      targetAge: `${template.minAge} - ${template.maxAge} Years`,
      totalChildren: children.length,
      counts: {
        eligible: eligible.length,
        conflicts: conflicts.length,
        excluded: excluded.length,
        alreadyAssigned: alreadyAssigned.length,
      },
      eligible,
      conflicts,
      excluded,
    };
  }

  async confirmAutoAssign(adminId: string, dto: ConfirmAutoAssignDto) {
    const preview = await this.previewAutoAssign(dto.dietTemplateId);
    let targetChildIds = preview.eligible.map((c: any) => c.id);

    if (dto.selectedChildIds && dto.selectedChildIds.length > 0) {
      targetChildIds = targetChildIds.filter((id: string) => dto.selectedChildIds!.includes(id));
    }

    const assigned: any[] = [];
    for (const childId of targetChildIds) {
      const assignment = new this.assignmentModel({
        childId,
        dietTemplateId: dto.dietTemplateId,
        status: 'ACTIVE',
        assignmentSource: 'AUTOMATIC',
        assignedBy: adminId,
        assignedAt: new Date(),
        conflictFlagged: false,
      });
      await assignment.save();
      assigned.push(childId);
    }


    // Enable automatic assignment flag on template
    await this.templateModel.findByIdAndUpdate(dto.dietTemplateId, {
      $set: { automaticAssignmentEnabled: true, assignmentMode: 'AUTOMATIC' },
    });

    return {
      success: true,
      assignedCount: assigned.length,
      templateName: preview.templateName,
    };
  }

  // --- CONFLICTS ---

  async getConflicts() {
    const conflicts = await this.assignmentModel
      .find({ conflictFlagged: true, conflictResolved: false, status: { $ne: 'CANCELLED' } })
      .populate('dietTemplateId', 'name minAge maxAge ageUnit category')
      .populate({
        path: 'childId',
        select: 'firstName lastName dateOfBirth gender allergies medicalConditions parentId',
        populate: { path: 'parentId', select: 'fullName email phone' },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return conflicts.map((c: any) => {
      const child = c.childId;
      const template = c.dietTemplateId;
      const parent = child?.parentId;
      const ageYears = child?.dateOfBirth ? this.calculateChildAgeInYears(child.dateOfBirth) : null;

      return {
        id: c._id.toString(),
        assignmentId: c._id.toString(),
        childId: child?._id?.toString(),
        childName: child ? `${child.firstName || ''} ${child.lastName || ''}`.trim() : 'Unknown Child',
        childAge: ageYears !== null ? `${ageYears} yrs` : 'Unknown',
        allergies: child?.allergies || 'Unspecified',
        parentName: parent?.fullName || 'Unassigned Parent',
        parentContact: parent?.email || parent?.phone || 'No contact',
        dietTemplateId: template?._id?.toString(),
        dietTemplateName: template?.name || 'Diet Template',
        conflictReason: c.conflictReason || 'Documented allergy conflicts with assigned diet plan.',
        assignedAt: c.assignedAt || c.createdAt,
      };
    });
  }

  async resolveConflict(adminId: string, assignmentId: string, dto: ResolveConflictDto) {
    if (!Types.ObjectId.isValid(assignmentId)) throw new BadRequestException('Invalid assignment ID');
    const assignment = await this.assignmentModel.findById(assignmentId).exec();
    if (!assignment) throw new NotFoundException('Diet assignment not found');

    if (dto.action === 'CANCEL_ASSIGNMENT') {
      assignment.status = 'CANCELLED';
      assignment.conflictResolved = true;
      assignment.resolvedBy = adminId;
      assignment.resolvedAt = new Date();
      assignment.resolutionNotes = dto.notes || 'Assignment cancelled due to safety allergy conflict.';
    } else if (dto.action === 'SWITCH_TEMPLATE') {
      if (!dto.newDietTemplateId) throw new BadRequestException('New diet template ID is required to switch plan');
      const newTemplate = await this.templateModel.findById(dto.newDietTemplateId).lean().exec();
      if (!newTemplate) throw new NotFoundException('New diet template not found');

      const child = await this.childModel.findById(assignment.childId).lean().exec();
      const conflictCheck = this.detectAllergyConflict(child, newTemplate);

      assignment.dietTemplateId = dto.newDietTemplateId;
      assignment.conflictFlagged = conflictCheck.hasConflict;
      assignment.conflictReason = conflictCheck.hasConflict ? conflictCheck.reason : undefined;
      assignment.conflictResolved = !conflictCheck.hasConflict;
      assignment.resolvedBy = adminId;
      assignment.resolvedAt = new Date();
      assignment.status = conflictCheck.hasConflict ? 'FLAGGED_CONFLICT' : 'ACTIVE';
      assignment.resolutionNotes = dto.notes || `Reassigned to safe template: ${newTemplate.name}`;
    } else if (dto.action === 'OVERRIDE_CLINICAL') {
      assignment.conflictResolved = true;
      assignment.status = 'ACTIVE';
      assignment.resolvedBy = adminId;
      assignment.resolvedAt = new Date();
      assignment.resolutionNotes = dto.notes || 'Clinically approved after medical review.';
    }

    await assignment.save();
    return { success: true, message: 'Conflict resolved successfully' };
  }

  // --- DASHBOARD SUMMARY ---

  async getDashboardSummary() {
    const [templatesCount, activeAssignmentsCount, unresolvedConflictsCount, foodsCount] = await Promise.all([
      this.templateModel.countDocuments({ status: { $ne: 'ARCHIVED' } }),
      this.assignmentModel.countDocuments({ status: 'ACTIVE' }),
      this.assignmentModel.countDocuments({ conflictFlagged: true, conflictResolved: false, status: { $ne: 'CANCELLED' } }),
      this.foodModel.countDocuments({ status: 'ACTIVE' }),
    ]);

    return {
      totalTemplates: templatesCount,
      totalAssigned: activeAssignmentsCount,
      unresolvedConflicts: unresolvedConflictsCount,
      totalFoods: foodsCount,
    };
  }
}
