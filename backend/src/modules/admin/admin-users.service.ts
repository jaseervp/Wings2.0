import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserStatus, UserPlan } from '../users/schemas/user.schema';
import { Child, ChildDocument } from '../children/schemas/child.schema';
import { ListAdminUsersDto } from './dto/list-admin-users.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { OnboardingStatus } from '../../common/enums/onboarding-status.enum';
import { UserRole } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
  ) {}

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private buildMatchFilter(query: ListAdminUsersDto): any {
    const match: any = {};

    // Role filter
    if (query.role && query.role !== 'ALL' && query.role !== 'All Users') {
      const normalizedRole = query.role.toUpperCase();
      if (['PARENT', 'THERAPIST', 'ADMIN'].includes(normalizedRole)) {
        match.role = normalizedRole;
      }
    }

    // Status filter
    if (query.status && query.status !== 'ALL') {
      const normalizedStatus = query.status.toUpperCase();
      if (Object.values(UserStatus).includes(normalizedStatus as UserStatus)) {
        match.status = normalizedStatus;
      }
    }

    // Plan filter
    if (query.plan && query.plan !== 'ALL') {
      const normalizedPlan = query.plan.toUpperCase();
      if (Object.values(UserPlan).includes(normalizedPlan as UserPlan)) {
        match.plan = normalizedPlan;
      }
    }

    // Search by name or email
    if (query.search && query.search.trim()) {
      const escaped = this.escapeRegex(query.search.trim());
      match.$or = [
        { fullName: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    return match;
  }

  async findAll(query: ListAdminUsersDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const match = this.buildMatchFilter(query);

    const allowedSortFields = ['createdAt', 'fullName', 'email', 'status', 'role', 'plan'];
    const sortBy = allowedSortFields.includes(query.sortBy || '') ? query.sortBy : 'createdAt';
    const sortOrder = (query.sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;

    const pipeline: any[] = [
      { $match: match },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          users: [
            { $sort: { [sortBy as string]: sortOrder, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'children',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ['$parentId', '$$userId'] },
                          { $eq: ['$parentId', { $toString: '$$userId' }] },
                        ],
                      },
                    },
                  },
                  { $count: 'count' },
                ],
                as: 'childCountResult',
              },
            },
            {
              $addFields: {
                childrenCount: {
                  $cond: [
                    { $eq: ['$role', UserRole.PARENT] },
                    { $ifNull: [{ $arrayElemAt: ['$childCountResult.count', 0] }, 0] },
                    null,
                  ],
                },
                id: '$_id',
              },
            },
            {
              $project: {
                passwordHash: 0,
                refreshTokenHash: 0,
                childCountResult: 0,
              },
            },
          ],
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline).exec();
    const total = result[0]?.totalCount[0]?.count || 0;
    const users = result[0]?.users || [];
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: users,
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
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).select('-passwordHash -refreshTokenHash').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let children: ChildDocument[] = [];
    if (user.role === UserRole.PARENT) {
      children = await this.childModel.find({
        parentId: user._id.toString(),
      }).exec();
    }

    return {
      success: true,
      data: {
        ...user.toObject(),
        id: user._id,
        children,
        childrenCount: user.role === UserRole.PARENT ? children.length : null,
      },
    };
  }

  async create(adminId: string, dto: CreateAdminUserDto) {
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

    const onboardingStatus = dto.role === UserRole.PARENT 
      ? OnboardingStatus.NOT_STARTED 
      : OnboardingStatus.COMPLETED;

    const requestedStatus = dto.status || UserStatus.ACTIVE;
    const isPending = requestedStatus === UserStatus.PENDING_VERIFICATION;

    const user = new this.userModel({
      fullName: dto.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: dto.role,
      status: requestedStatus,
      plan: dto.plan || UserPlan.FREE,
      specialization: dto.specialization || (dto.role === UserRole.THERAPIST ? 'General Therapist' : null),
      availability: dto.availability || (dto.role === UserRole.THERAPIST ? 'Mon - Fri' : null),
      onboardingStatus,
      emailVerified: !isPending,
      phoneVerified: !isPending,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });

    const savedUser = await user.save();

    this.logger.log(
      `[AdminAudit] Admin [${adminId}] created user [${savedUser._id}] (${normalizedEmail}) - Role: ${dto.role}, Status: ${savedUser.status}, Plan: ${savedUser.plan}`
    );

    const rawObj: any = savedUser.toObject();
    delete rawObj.passwordHash;
    delete rawObj.refreshTokenHash;

    return {
      success: true,
      message: 'User created successfully',
      data: {
        ...rawObj,
        id: savedUser._id,
        childrenCount: dto.role === UserRole.PARENT ? 0 : null,
      },
    };
  }

  async update(adminId: string, id: string, dto: UpdateAdminUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Safety constraint: Prevent admins from deactivating or banning themselves
    if (id === adminId && dto.status && [UserStatus.INACTIVE, UserStatus.SUSPENDED, UserStatus.BANNED].includes(dto.status)) {
      throw new BadRequestException('Administrators cannot deactivate, suspend, or ban their own account');
    }

    // Safety constraint: Prevent admins from removing their own admin role
    if (id === adminId && dto.role && dto.role !== UserRole.ADMIN) {
      throw new BadRequestException('Administrators cannot revoke their own admin permissions');
    }

    if (dto.email && dto.email.toLowerCase().trim() !== user.email) {
      const emailConflict = await this.userModel.findOne({ 
        email: dto.email.toLowerCase().trim(),
        _id: { $ne: id },
      }).exec();
      if (emailConflict) {
        throw new ConflictException('A user with this email address already exists');
      }
      user.email = dto.email.toLowerCase().trim();
    }

    if (dto.phone && dto.phone.trim() !== user.phone) {
      const phoneConflict = await this.userModel.findOne({ 
        phone: dto.phone.trim(),
        _id: { $ne: id },
      }).exec();
      if (phoneConflict) {
        throw new ConflictException('A user with this phone number already exists');
      }
      user.phone = dto.phone.trim();
    }

    if (dto.fullName) user.fullName = dto.fullName.trim();
    if (dto.role) user.role = dto.role;
    if (dto.status) user.status = dto.status;
    if (dto.plan) user.plan = dto.plan;
    if (dto.emailVerified !== undefined) user.emailVerified = dto.emailVerified;
    if (dto.specialization !== undefined) user.specialization = dto.specialization;
    if (dto.availability !== undefined) user.availability = dto.availability;
    if (dto.activePatientCount !== undefined) user.activePatientCount = dto.activePatientCount;

    const updatedUser = await user.save();
    const rawObj: any = updatedUser.toObject();
    delete rawObj.passwordHash;
    delete rawObj.refreshTokenHash;

    let childrenCount: number | null = null;
    if (updatedUser.role === UserRole.PARENT) {
      childrenCount = await this.childModel.countDocuments({
        parentId: updatedUser._id.toString(),
      });
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: {
        ...rawObj,
        id: updatedUser._id,
        childrenCount,
      },
    };
  }

  async delete(adminId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    if (id === adminId) {
      throw new BadRequestException('Administrators cannot delete their own account');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(id).exec();

    return {
      success: true,
      message: 'User deleted successfully',
      data: { id },
    };
  }

  async exportCsv(query: ListAdminUsersDto): Promise<string> {
    const match = this.buildMatchFilter(query);

    const users = await this.userModel.aggregate([
      { $match: match },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: 5000 },
      {
        $lookup: {
          from: 'children',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$parentId', '$$userId'] },
                    { $eq: ['$parentId', { $toString: '$$userId' }] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'childCountResult',
        },
      },
      {
        $addFields: {
          childrenCount: {
            $cond: [
              { $eq: ['$role', UserRole.PARENT] },
              { $ifNull: [{ $arrayElemAt: ['$childCountResult.count', 0] }, 0] },
              null,
            ],
          },
        },
      },
    ]).exec();

    const headers = [
      'User ID',
      'Full Name',
      'Email',
      'Phone',
      'Role',
      'Children',
      'Plan Status',
      'Account State',
      'Joined Date',
      'Email Verified',
    ];

    const escapeCsvCell = (val: any): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = users.map(u => {
      const joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '';
      const children = u.childrenCount !== null ? u.childrenCount : 'N/A';
      return [
        escapeCsvCell(u._id),
        escapeCsvCell(u.fullName),
        escapeCsvCell(u.email),
        escapeCsvCell(u.phone),
        escapeCsvCell(u.role),
        escapeCsvCell(children),
        escapeCsvCell(u.plan || 'FREE'),
        escapeCsvCell(u.status),
        escapeCsvCell(joinedDate),
        escapeCsvCell(u.emailVerified ? 'Yes' : 'No'),
      ].join(',');
    });

    return [headers.map(escapeCsvCell).join(','), ...rows].join('\r\n');
  }
}
