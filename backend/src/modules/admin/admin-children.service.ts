import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Child, ChildDocument, Gender } from '../children/schemas/child.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '../../common/enums/role.enum';
import { AssessmentResponse, AssessmentResponseDocument } from '../assessment/schemas/assessment-response.schema';
import { ListAdminChildrenDto } from './dto/list-admin-children.dto';
import { CreateAdminChildDto } from './dto/create-admin-child.dto';
import { UpdateAdminChildDto } from './dto/update-admin-child.dto';

@Injectable()
export class AdminChildrenService {
  private readonly logger = new Logger(AdminChildrenService.name);

  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(AssessmentResponse.name) private readonly assessmentModel: Model<AssessmentResponseDocument>,
  ) {}

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public calculateAge(dob: Date | string): { years: number; months: number; text: string } {
    if (!dob) return { years: 0, months: 0, text: '—' };
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return { years: 0, months: 0, text: '—' };

    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (now.getDate() < birth.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    years = Math.max(0, years);
    months = Math.max(0, months);

    return {
      years,
      months,
      text: `${years} yrs ${months} mo`,
    };
  }

  public formatRelativeTime(date: Date | string | null): string {
    if (!date) return 'Never';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 0) return 'Recent';

    const diffSecs = Math.floor(diffMs / 1000);
    const diffDays = Math.floor(diffSecs / 86400);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    const weeks = Math.floor(diffDays / 7);
    if (weeks < 4) return `${weeks} ${weeks === 1 ? 'wk' : 'wks'} ago`;
    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} ${months === 1 ? 'mo' : 'mos'} ago`;
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'yr' : 'yrs'} ago`;
  }

  private getDateRangeFromAgeFilter(ageRange?: string, minAge?: number, maxAge?: number): { start?: Date; end?: Date } {
    let min = minAge;
    let max = maxAge;

    if (ageRange && ageRange !== 'All' && ageRange !== 'Age Range: All') {
      const lower = ageRange.toLowerCase();
      if (lower.includes('0') && lower.includes('2')) {
        min = 0; max = 2;
      } else if (lower.includes('3') && lower.includes('4')) {
        min = 3; max = 4;
      } else if (lower.includes('5') && lower.includes('6')) {
        min = 5; max = 6;
      } else if (lower.includes('7') && lower.includes('12')) {
        min = 7; max = 12;
      } else if (lower.includes('13')) {
        min = 13; max = 99;
      }
    }

    const now = new Date();
    const result: { start?: Date; end?: Date } = {};

    if (max !== undefined) {
      // Child age <= max => birthdate >= now - (max + 1) years
      const start = new Date(now);
      start.setFullYear(now.getFullYear() - (max + 1));
      result.start = start;
    }

    if (min !== undefined) {
      // Child age >= min => birthdate <= now - min years
      const end = new Date(now);
      end.setFullYear(now.getFullYear() - min);
      result.end = end;
    }

    return result;
  }

  async findAll(query: ListAdminChildrenDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 12));
    const skip = (page - 1) * limit;

    const matchConditions: any = { status: { $ne: 'DELETED' } };

    // Gender filter
    if (query.gender && query.gender !== 'All' && query.gender !== 'Gender: All') {
      const g = query.gender.toUpperCase();
      if (['MALE', 'FEMALE', 'OTHER'].includes(g)) {
        matchConditions.gender = g;
      }
    }

    // Age filter via dateOfBirth
    const dateRange = this.getDateRangeFromAgeFilter(query.ageRange, query.minAge, query.maxAge);
    if (dateRange.start || dateRange.end) {
      matchConditions.dateOfBirth = {};
      if (dateRange.start) matchConditions.dateOfBirth.$gte = dateRange.start;
      if (dateRange.end) matchConditions.dateOfBirth.$lte = dateRange.end;
    }

    // IQ Band / Diagnosis filter
    if (query.iqBand && query.iqBand !== 'All' && query.iqBand !== 'IQ Band: All') {
      const escapedIq = this.escapeRegex(query.iqBand.trim());
      matchConditions.$or = [
        { iqBand: { $regex: escapedIq, $options: 'i' } },
        { diagnosis: { $regex: escapedIq, $options: 'i' } },
      ];
    }

    const pipeline: any[] = [
      { $match: matchConditions },
      // Lookup Parent User
      {
        $lookup: {
          from: 'users',
          let: { pId: '$parentId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$pId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$pId' }] },
                  ],
                },
              },
            },
            {
              $project: {
                fullName: 1,
                email: 1,
                phone: 1,
                role: 1,
              },
            },
          ],
          as: 'parentUser',
        },
      },
      // Lookup Latest Assessment
      {
        $lookup: {
          from: 'assessmentresponses',
          let: { cId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$childId', '$$cId'] },
                    { $eq: [{ $toString: '$childId' }, { $toString: '$$cId' }] },
                  ],
                },
              },
            },
            { $sort: { completedAt: -1, createdAt: -1 } },
            { $limit: 1 },
          ],
          as: 'latestAssessment',
        },
      },
    ];

    // Search filter across child name and parent details
    if (query.search && query.search.trim()) {
      const escaped = this.escapeRegex(query.search.trim());
      const regex = { $regex: escaped, $options: 'i' };
      pipeline.push({
        $match: {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { preferredName: regex },
            { 'parentUser.fullName': regex },
            { 'parentUser.email': regex },
          ],
        },
      });
    }

    // Sorting & Pagination via Facet
    pipeline.push({
      $facet: {
        totalCount: [{ $count: 'count' }],
        children: [
          { $sort: { createdAt: -1, _id: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    });

    const result = await this.childModel.aggregate(pipeline).exec();
    const total = result[0]?.totalCount[0]?.count || 0;
    const rawChildren = result[0]?.children || [];
    const totalPages = Math.ceil(total / limit) || 1;

    const formattedChildren = rawChildren.map((c: any) => {
      const parentUser = c.parentUser?.[0] || null;
      const latestAssessment = c.latestAssessment?.[0] || null;
      const ageInfo = this.calculateAge(c.dateOfBirth);

      const lastExamDate = latestAssessment?.completedAt || c.lastExamDate || null;
      const lastExam = this.formatRelativeTime(lastExamDate);

      // Map diagnosis badge
      let diagnosis = c.diagnosis || 'PENDING';
      if (diagnosis === 'PENDING' && c.medicalConditions) {
        diagnosis = c.medicalConditions;
      }

      return {
        id: c._id.toString(),
        _id: c._id.toString(),
        firstName: c.firstName,
        lastName: c.lastName,
        preferredName: c.preferredName,
        fullName: `${c.firstName} ${c.lastName}`.trim(),
        dateOfBirth: c.dateOfBirth,
        age: ageInfo.text,
        ageYears: ageInfo.years,
        ageMonths: ageInfo.months,
        gender: c.gender,
        bloodGroup: c.bloodGroup,
        parentId: c.parentId,
        parent: parentUser?.fullName || 'Unassigned',
        parentEmail: parentUser?.email || '',
        parentPhone: parentUser?.phone || '',
        diagnosis: diagnosis,
        iqBand: c.iqBand || diagnosis,
        lastExam: lastExam,
        lastExamDate: lastExamDate,
        status: c.status || 'ACTIVE',
        medicalConditions: c.medicalConditions || '',
        allergies: c.allergies || '',
        medications: c.medications || '',
        birthType: c.birthType || '',
        birthWeight: c.birthWeight || null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return {
      success: true,
      data: formattedChildren,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid child ID format');
    }

    const child = await this.childModel.findById(id).lean().exec();
    if (!child || child.status === 'DELETED') {
      throw new NotFoundException('Child profile not found');
    }

    const [parentUser, assessments] = await Promise.all([
      this.userModel.findById(child.parentId).select('fullName email phone role').lean().exec(),
      this.assessmentModel
        .find({
          $or: [
            { childId: child._id.toString() },
            { childId: child._id as any },
          ],
        } as any)
        .sort({ completedAt: -1, createdAt: -1 })
        .lean()
        .exec(),
    ]);

    const ageInfo = this.calculateAge(child.dateOfBirth);
    const latestAssessment = assessments[0] || null;
    const lastExamDate = latestAssessment?.completedAt || (child as any).lastExamDate || null;

    return {
      success: true,
      data: {
        ...child,
        id: (child as any)._id.toString(),
        fullName: `${child.firstName} ${child.lastName}`.trim(),
        age: ageInfo.text,
        ageYears: ageInfo.years,
        ageMonths: ageInfo.months,
        parent: parentUser || null,
        parentName: parentUser?.fullName || 'Unassigned',
        assessments: assessments || [],
        latestAssessment: latestAssessment || null,
        lastExam: this.formatRelativeTime(lastExamDate),
        lastExamDate: lastExamDate,
      },
    };
  }

  async getParents(search?: string) {
    const filter: any = { role: UserRole.PARENT, status: { $ne: 'BANNED' } };
    if (search && search.trim()) {
      const escaped = this.escapeRegex(search.trim());
      const regex = { $regex: escaped, $options: 'i' };
      filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }];
    }

    const parents = await this.userModel
      .find(filter)
      .select('fullName email phone')
      .sort({ fullName: 1 })
      .limit(30)
      .lean()
      .exec();

    return {
      success: true,
      data: parents.map(p => ({
        id: (p as any)._id.toString(),
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
      })),
    };
  }

  async create(adminId: string, dto: CreateAdminChildDto) {
    if (!Types.ObjectId.isValid(dto.parentId)) {
      throw new BadRequestException('Invalid parent ID format');
    }

    const parent = await this.userModel.findById(dto.parentId).exec();
    if (!parent) {
      throw new NotFoundException('Selected parent account not found');
    }
    if (parent.role !== UserRole.PARENT) {
      throw new BadRequestException('The selected user account is not a registered parent');
    }

    const birthDate = new Date(dto.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('Invalid date of birth');
    }
    if (birthDate > new Date()) {
      throw new BadRequestException('Date of birth cannot be in the future');
    }

    const child = new this.childModel({
      parentId: parent._id.toString(),
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      preferredName: (dto.preferredName || '').trim(),
      dateOfBirth: birthDate,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup || null,
      diagnosis: dto.diagnosis || 'PENDING',
      iqBand: dto.iqBand || dto.diagnosis || 'Pending',
      birthType: dto.birthType || null,
      birthWeight: dto.birthWeight || null,
      medicalConditions: dto.medicalConditions || null,
      allergies: dto.allergies || null,
      medications: dto.medications || null,
      primaryConcerns: dto.primaryConcerns || null,
      status: dto.status || 'ACTIVE',
    });

    const savedChild = await child.save();

    this.logger.log(
      `[AdminAudit] Admin [${adminId}] created child profile [${savedChild._id}] for parent [${parent._id}] (${parent.fullName})`
    );

    const ageInfo = this.calculateAge(savedChild.dateOfBirth);

    return {
      success: true,
      message: 'Child profile created successfully',
      data: {
        ...savedChild.toObject(),
        id: savedChild._id.toString(),
        fullName: `${savedChild.firstName} ${savedChild.lastName}`.trim(),
        age: ageInfo.text,
        parent: parent.fullName,
        parentEmail: parent.email,
      },
    };
  }

  async update(adminId: string, id: string, dto: UpdateAdminChildDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid child ID format');
    }

    const child = await this.childModel.findById(id).exec();
    if (!child || child.status === 'DELETED') {
      throw new NotFoundException('Child profile not found');
    }

    if (dto.parentId && dto.parentId !== child.parentId.toString()) {
      if (!Types.ObjectId.isValid(dto.parentId)) {
        throw new BadRequestException('Invalid parent ID format');
      }
      const parent = await this.userModel.findById(dto.parentId).exec();
      if (!parent || parent.role !== UserRole.PARENT) {
        throw new BadRequestException('Selected parent account is invalid');
      }
      child.parentId = parent._id.toString();
    }

    if (dto.firstName) child.firstName = dto.firstName.trim();
    if (dto.lastName) child.lastName = dto.lastName.trim();
    if (dto.preferredName !== undefined) child.preferredName = dto.preferredName.trim();
    if (dto.dateOfBirth) {
      const birthDate = new Date(dto.dateOfBirth);
      if (birthDate > new Date()) {
        throw new BadRequestException('Date of birth cannot be in the future');
      }
      child.dateOfBirth = birthDate;
    }
    if (dto.gender) child.gender = dto.gender;
    if (dto.bloodGroup !== undefined) child.bloodGroup = dto.bloodGroup;
    if (dto.diagnosis !== undefined) child.diagnosis = dto.diagnosis;
    if (dto.iqBand !== undefined) child.iqBand = dto.iqBand;
    if (dto.birthType !== undefined) child.birthType = dto.birthType;
    if (dto.birthWeight !== undefined) child.birthWeight = dto.birthWeight;
    if (dto.medicalConditions !== undefined) child.medicalConditions = dto.medicalConditions;
    if (dto.allergies !== undefined) child.allergies = dto.allergies;
    if (dto.medications !== undefined) child.medications = dto.medications;
    if (dto.primaryConcerns !== undefined) child.primaryConcerns = dto.primaryConcerns;
    if (dto.status !== undefined) child.status = dto.status;

    const saved = await child.save();

    this.logger.log(
      `[AdminAudit] Admin [${adminId}] updated child profile [${saved._id}]`
    );

    return {
      success: true,
      message: 'Child profile updated successfully',
      data: {
        ...saved.toObject(),
        id: saved._id.toString(),
        fullName: `${saved.firstName} ${saved.lastName}`.trim(),
        age: this.calculateAge(saved.dateOfBirth).text,
      },
    };
  }

  async delete(adminId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid child ID format');
    }

    const child = await this.childModel.findById(id).exec();
    if (!child) {
      throw new NotFoundException('Child profile not found');
    }

    child.status = 'DELETED';
    await child.save();

    this.logger.log(`[AdminAudit] Admin [${adminId}] soft-deleted child profile [${id}]`);

    return {
      success: true,
      message: 'Child profile deleted successfully',
      data: { id },
    };
  }

  async exportCsv(query: ListAdminChildrenDto): Promise<string> {
    const listResult = await this.findAll({ ...query, limit: 1000, page: 1 });
    const children = listResult.data || [];

    const headers = [
      'Child ID',
      'Child Name',
      'Preferred Name',
      'Date of Birth',
      'Calculated Age',
      'Gender',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'Diagnosis',
      'IQ Band',
      'Last Exam / Assessment',
      'Status',
    ];

    const sanitize = (val: any): string => {
      if (val === null || val === undefined) return '';
      let str = String(val).trim();
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = children.map((c: any) => [
      sanitize(c.id),
      sanitize(c.fullName),
      sanitize(c.preferredName || ''),
      sanitize(c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().split('T')[0] : ''),
      sanitize(c.age),
      sanitize(c.gender),
      sanitize(c.parent),
      sanitize(c.parentEmail),
      sanitize(c.parentPhone),
      sanitize(c.diagnosis),
      sanitize(c.iqBand),
      sanitize(c.lastExam),
      sanitize(c.status),
    ]);

    const csvLines = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.join(',')),
    ];

    return csvLines.join('\n');
  }
}
