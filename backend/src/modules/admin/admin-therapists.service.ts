import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserStatus, UserPlan } from '../users/schemas/user.schema';
import { ListAdminTherapistsDto } from './dto/list-admin-therapists.dto';
import { CreateAdminTherapistDto } from './dto/create-admin-therapist.dto';
import { UpdateAdminTherapistDto } from './dto/update-admin-therapist.dto';
import { UserRole } from '../../common/enums/role.enum';
import { OnboardingStatus } from '../../common/enums/onboarding-status.enum';
import * as bcrypt from 'bcrypt';

const CANONICAL_SPECIALIZATIONS = [
  'Speech Therapy',
  'Occupational Therapy',
  'Child Psychology',
  'Behavioral Therapy',
  'Special Education',
  'Clinical Psychology',
  'Physiotherapy',
];

@Injectable()
export class AdminTherapistsService {
  private readonly logger = new Logger(AdminTherapistsService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private buildQueryFilter(query: ListAdminTherapistsDto): any {
    const filter: any = { role: UserRole.THERAPIST };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.specialization && query.specialization !== 'All Specializations') {
      const escapedSpec = this.escapeRegex(query.specialization.trim());
      filter.specialization = { $regex: escapedSpec, $options: 'i' };
    }

    if (query.search && query.search.trim()) {
      const escaped = this.escapeRegex(query.search.trim());
      const regex = { $regex: escaped, $options: 'i' };
      filter.$or = [
        { fullName: regex },
        { specialization: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    return filter;
  }

  async findAll(query: ListAdminTherapistsDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 9));
    const skip = (page - 1) * limit;

    const filter = this.buildQueryFilter(query);

    const [total, therapists] = await Promise.all([
      this.userModel.countDocuments(filter).exec(),
      this.userModel
        .find(filter)
        .select('-passwordHash -refreshTokenHash')
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    const formattedTherapists = therapists.map((t: any) => ({
      ...t,
      id: t._id.toString(),
      specialization: t.specialization || 'General Specialist',
      availability: t.availability || 'Mon - Fri',
      rating: t.rating ?? null,
      reviewCount: t.reviewCount ?? 0,
      activePatientCount: t.activePatientCount ?? 0,
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: formattedTherapists,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getSpecializations(): Promise<string[]> {
    const distinctSpecs = await this.userModel
      .distinct('specialization', {
        role: UserRole.THERAPIST,
        specialization: { $ne: null },
      })
      .exec();

    const set = new Set<string>();
    CANONICAL_SPECIALIZATIONS.forEach((s) => set.add(s));
    distinctSpecs.forEach((s) => {
      if (s && typeof s === 'string' && s.trim()) {
        set.add(s.trim());
      }
    });

    return Array.from(set).sort();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid therapist ID format');
    }

    const therapist = await this.userModel
      .findOne({ _id: id, role: UserRole.THERAPIST })
      .select('-passwordHash -refreshTokenHash')
      .lean()
      .exec();

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return {
      success: true,
      data: {
        ...therapist,
        id: (therapist as any)._id.toString(),
        specialization: therapist.specialization || 'General Specialist',
        availability: therapist.availability || 'Mon - Fri',
      },
    };
  }

  async create(adminId: string, dto: CreateAdminTherapistDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedPhone = dto.phone.trim();

    const existingEmail = await this.userModel.findOne({ email: normalizedEmail }).exec();
    if (existingEmail) {
      throw new ConflictException('A user with this email address already exists');
    }

    const existingPhone = await this.userModel.findOne({ phone: normalizedPhone }).exec();
    if (existingPhone) {
      throw new ConflictException('A user with this phone number already exists');
    }

    const plainPassword = dto.temporaryPassword || dto.password;
    if (!plainPassword) {
      throw new BadRequestException('A temporary password of at least 6 characters is required');
    }
    if (plainPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const requestedStatus = dto.status || UserStatus.ACTIVE;
    const isPending = requestedStatus === UserStatus.PENDING_VERIFICATION;

    const therapist = new this.userModel({
      fullName: dto.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: UserRole.THERAPIST,
      status: requestedStatus,
      plan: UserPlan.PRO,
      specialization: dto.specialization.trim(),
      availability: (dto.availability || 'Mon - Fri').trim(),
      rating: null,
      reviewCount: 0,
      activePatientCount: 0,
      onboardingStatus: OnboardingStatus.COMPLETED,
      emailVerified: !isPending,
      phoneVerified: !isPending,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });

    const savedTherapist = await therapist.save();

    this.logger.log(
      `[AdminAudit] Admin [${adminId}] created therapist [${savedTherapist._id}] (${normalizedEmail}) with specialization [${dto.specialization}]`
    );

    const rawObj: any = savedTherapist.toObject();
    delete rawObj.passwordHash;
    delete rawObj.refreshTokenHash;

    return {
      success: true,
      message: 'Therapist created successfully',
      data: {
        ...rawObj,
        id: savedTherapist._id.toString(),
      },
    };
  }

  async update(adminId: string, id: string, dto: UpdateAdminTherapistDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid therapist ID format');
    }

    const therapist = await this.userModel.findOne({ _id: id, role: UserRole.THERAPIST }).exec();
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    if (dto.email && dto.email.toLowerCase().trim() !== therapist.email) {
      const emailConflict = await this.userModel.findOne({
        email: dto.email.toLowerCase().trim(),
        _id: { $ne: id },
      }).exec();
      if (emailConflict) {
        throw new ConflictException('A user with this email address already exists');
      }
      therapist.email = dto.email.toLowerCase().trim();
    }

    if (dto.phone && dto.phone.trim() !== therapist.phone) {
      const phoneConflict = await this.userModel.findOne({
        phone: dto.phone.trim(),
        _id: { $ne: id },
      }).exec();
      if (phoneConflict) {
        throw new ConflictException('A user with this phone number already exists');
      }
      therapist.phone = dto.phone.trim();
    }

    if (dto.fullName) therapist.fullName = dto.fullName.trim();
    if (dto.specialization) therapist.specialization = dto.specialization.trim();
    if (dto.availability) therapist.availability = dto.availability.trim();
    if (dto.status) therapist.status = dto.status;
    if (dto.activePatientCount !== undefined) therapist.activePatientCount = dto.activePatientCount;

    const updated = await therapist.save();

    this.logger.log(
      `[AdminAudit] Admin [${adminId}] updated therapist [${updated._id}] (${updated.email})`
    );

    const rawObj: any = updated.toObject();
    delete rawObj.passwordHash;
    delete rawObj.refreshTokenHash;

    return {
      success: true,
      message: 'Therapist profile updated successfully',
      data: {
        ...rawObj,
        id: updated._id.toString(),
      },
    };
  }

  async delete(adminId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid therapist ID format');
    }

    if (id === adminId) {
      throw new BadRequestException('Administrators cannot delete their own account');
    }

    const therapist = await this.userModel.findOneAndDelete({
      _id: id,
      role: UserRole.THERAPIST,
    }).exec();

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    this.logger.log(`[AdminAudit] Admin [${adminId}] deleted therapist [${id}] (${therapist.email})`);

    return {
      success: true,
      message: 'Therapist deleted successfully',
      data: { id },
    };
  }

  async exportCsv(query: ListAdminTherapistsDto): Promise<string> {
    const filter = this.buildQueryFilter(query);

    const therapists = await this.userModel
      .find(filter)
      .select('-passwordHash -refreshTokenHash')
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    const headers = [
      'Therapist ID',
      'Full Name',
      'Email',
      'Phone',
      'Specialization',
      'Availability',
      'Active Patients',
      'Rating',
      'Review Count',
      'Account State',
      'Joined Date',
    ];

    const sanitize = (val: any): string => {
      if (val === null || val === undefined) return '';
      let str = String(val).trim();
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = therapists.map((t: any) => [
      sanitize(t._id.toString()),
      sanitize(t.fullName),
      sanitize(t.email),
      sanitize(t.phone || 'N/A'),
      sanitize(t.specialization || 'General Specialist'),
      sanitize(t.availability || 'Mon - Fri'),
      sanitize(t.activePatientCount ?? 0),
      sanitize(t.rating ? t.rating.toFixed(1) : 'N/A'),
      sanitize(t.reviewCount ?? 0),
      sanitize(t.status),
      sanitize(t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : 'N/A'),
    ]);

    const csvLines = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.join(',')),
    ];

    return csvLines.join('\n');
  }
}
