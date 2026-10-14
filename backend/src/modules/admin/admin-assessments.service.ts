import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AssessmentResponse, AssessmentResponseDocument } from '../assessment/schemas/assessment-response.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Child, ChildDocument } from '../children/schemas/child.schema';
import { ListAdminAssessmentsDto } from './dto/list-admin-assessments.dto';
import { ReviewAdminAssessmentDto } from './dto/review-admin-assessment.dto';
import { FlagAdminAssessmentDto } from './dto/flag-admin-assessment.dto';

export const STANDARDIZED_QUESTIONS = [
  {
    index: 0,
    category: 'Social Interaction',
    text: 'Does your child respond to their name when called?',
    explanation: 'Notice if they look up, turn towards you, or verbally acknowledge when you say their name in a normal tone.',
  },
  {
    index: 1,
    category: 'Social Interaction',
    text: 'Does your child show interest in other children?',
    explanation: 'This includes watching other children play, trying to join in, or initiating interaction.',
  },
  {
    index: 2,
    category: 'Communication',
    text: 'Does your child make eye contact for more than a second or two?',
    explanation: 'Observe if they meet your gaze during conversations or while playing together.',
  },
  {
    index: 3,
    category: 'Speech & Language',
    text: 'Are there any delays in their speech compared to siblings or peers?',
    explanation: 'Consider their vocabulary size and ability to form short sentences compared to typical milestones.',
  },
  {
    index: 4,
    category: 'Motor Skills & Gestures',
    text: 'Does your child point to things they want?',
    explanation: 'Using an index finger to point at objects out of reach to request them or draw your attention.',
  },
];

const ANSWER_LABELS: Record<string, string> = {
  always: 'Always',
  often: 'Often',
  sometimes: 'Sometimes',
  never: 'Never',
};

@Injectable()
export class AdminAssessmentsService {
  constructor(
    @InjectModel(AssessmentResponse.name)
    private readonly assessmentModel: Model<AssessmentResponseDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Child.name)
    private readonly childModel: Model<ChildDocument>,
  ) {}

  private escapeRegex(str: string): string {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  public formatSubmissionDate(date: Date | string | null): string {
    if (!date) return 'Not submitted';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Not submitted';

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const timeStr = `${formattedHours}:${minutes} ${ampm}`;

    if (isToday) {
      return `Today ${timeStr}`;
    }
    if (isYesterday) {
      return 'Yesterday';
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}, ${d.getFullYear()}`;
  }

  public calculateCompletion(responses: Record<string, string> | undefined, status?: string): {
    completion: number;
    answered: number;
    total: number;
  } {
    const total = STANDARDIZED_QUESTIONS.length;
    if (!responses || typeof responses !== 'object') {
      const isComplete = status === 'COMPLETED' || status === 'REVIEWED' || status === 'NEEDS_REVIEW';
      return {
        completion: isComplete ? 100 : 0,
        answered: isComplete ? total : 0,
        total,
      };
    }

    const answered = Object.values(responses).filter(
      (v) => v !== null && v !== undefined && String(v).trim() !== '',
    ).length;

    if (answered >= total || status === 'COMPLETED' || status === 'REVIEWED') {
      return { completion: 100, answered: Math.max(answered, total), total };
    }

    const percentage = Math.min(100, Math.round((answered / total) * 100));
    return { completion: percentage, answered, total };
  }

  public normalizeStatus(rawStatus?: string, reviewedAt?: Date | null): {
    code: 'NEEDS_REVIEW' | 'REVIEWED' | 'IN_PROGRESS';
    label: 'Needs Review' | 'Reviewed' | 'In Progress';
  } {
    const upper = (rawStatus || '').toUpperCase();
    if (upper === 'REVIEWED' || (reviewedAt && upper !== 'IN_PROGRESS' && upper !== 'DRAFT')) {
      return { code: 'REVIEWED', label: 'Reviewed' };
    }
    if (upper === 'DRAFT' || upper === 'IN_PROGRESS') {
      return { code: 'IN_PROGRESS', label: 'In Progress' };
    }
    // Default submitted state
    return { code: 'NEEDS_REVIEW', label: 'Needs Review' };
  }

  public getAssessmentCode(doc: any): string {
    if (doc.assessmentCode && doc.assessmentCode.trim()) {
      return doc.assessmentCode.trim();
    }
    const idStr = doc._id ? doc._id.toString() : '';
    const suffix = idStr ? idStr.slice(-4).toUpperCase() : '0000';
    return `A-${suffix}`;
  }

  async findAll(query: ListAdminAssessmentsDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const matchConditions: any = { type: 'PRELIMINARY' };

    // Date range filter
    if (query.dateFrom || query.dateTo) {
      matchConditions.completedAt = {};
      if (query.dateFrom) {
        matchConditions.completedAt.$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        const to = new Date(query.dateTo);
        to.setHours(23, 59, 59, 999);
        matchConditions.completedAt.$lte = to;
      }
    }

    // Flagged filter
    if (query.flagged !== undefined) {
      matchConditions.flagged = query.flagged;
    }

    // Status filter
    if (query.status && query.status !== 'ALL') {
      const statusUpper = query.status.toUpperCase();
      if (statusUpper === 'REVIEWED') {
        matchConditions.status = 'REVIEWED';
      } else if (statusUpper === 'IN_PROGRESS') {
        matchConditions.status = { $in: ['IN_PROGRESS', 'DRAFT'] };
      } else if (statusUpper === 'NEEDS_REVIEW') {
        matchConditions.status = { $in: ['NEEDS_REVIEW', 'COMPLETED'] };
        matchConditions.reviewedAt = { $exists: false };
      }
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
      // Lookup Child
      {
        $lookup: {
          from: 'children',
          let: { cId: '$childId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$cId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$cId' }] },
                  ],
                },
              },
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                preferredName: 1,
                dateOfBirth: 1,
                gender: 1,
                diagnosis: 1,
              },
            },
          ],
          as: 'childDoc',
        },
      },
      {
        $unwind: {
          path: '$parentUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$childDoc',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // Search filter across ID, child name, parent name, parent email
    if (query.search && query.search.trim()) {
      const cleanSearch = query.search.trim();
      const escaped = this.escapeRegex(cleanSearch);
      const orClauses: any[] = [
        { assessmentCode: { $regex: escaped, $options: 'i' } },
        { 'childDoc.firstName': { $regex: escaped, $options: 'i' } },
        { 'childDoc.lastName': { $regex: escaped, $options: 'i' } },
        { 'childDoc.preferredName': { $regex: escaped, $options: 'i' } },
        { 'parentUser.fullName': { $regex: escaped, $options: 'i' } },
        { 'parentUser.email': { $regex: escaped, $options: 'i' } },
      ];

      if (Types.ObjectId.isValid(cleanSearch)) {
        orClauses.push({ _id: new Types.ObjectId(cleanSearch) });
      }

      pipeline.push({ $match: { $or: orClauses } });
    }

    // Dynamic sorting
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    pipeline.push({
      $facet: {
        totalCount: [{ $count: 'count' }],
        data: [
          { $sort: { [sortField]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    });

    const [result] = await this.assessmentModel.aggregate(pipeline).exec();

    const total = result?.totalCount?.[0]?.count || 0;
    const rawData = result?.data || [];

    const formattedData = rawData.map((doc: any) => {
      const assessmentCode = this.getAssessmentCode(doc);
      const { completion, answered, total: totalQs } = this.calculateCompletion(
        doc.responses,
        doc.status,
      );
      const { code: statusCode, label: displayStatus } = this.normalizeStatus(
        doc.status,
        doc.reviewedAt,
      );

      const childName = doc.childDoc
        ? `${doc.childDoc.firstName || ''} ${doc.childDoc.lastName || ''}`.trim() ||
          doc.childDoc.preferredName ||
          'Unnamed Child'
        : 'Unassigned Child';

      const parentName = doc.parentUser?.fullName || 'Unassigned Parent';

      const submissionDate = doc.completedAt || doc.createdAt;
      const formattedDate = this.formatSubmissionDate(submissionDate);

      return {
        id: doc._id.toString(),
        assessmentCode,
        childId: doc.childId ? doc.childId.toString() : null,
        child: {
          id: doc.childDoc?._id?.toString() || doc.childId?.toString(),
          name: childName,
          gender: doc.childDoc?.gender || null,
          dateOfBirth: doc.childDoc?.dateOfBirth || null,
        },
        parentId: doc.parentId ? doc.parentId.toString() : null,
        parent: {
          id: doc.parentUser?._id?.toString() || doc.parentId?.toString(),
          name: parentName,
          email: doc.parentUser?.email || null,
          phone: doc.parentUser?.phone || null,
        },
        submittedAt: submissionDate,
        date: formattedDate,
        completion,
        answeredQuestions: answered,
        totalQuestions: totalQs,
        status: displayStatus,
        statusCode,
        flagged: Boolean(doc.flagged),
        flagReason: doc.flagReason || null,
        reviewedAt: doc.reviewedAt || null,
        reviewedBy: doc.reviewedBy || null,
        reviewNotes: doc.reviewNotes || null,
        version: doc.version || '1.0',
      };
    });

    // Summary counts for filter views
    const summary = await this.getSummaryCounts();

    return {
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      summary,
    };
  }

  private async getSummaryCounts() {
    try {
      const [allCounts] = await this.assessmentModel.aggregate([
        { $match: { type: 'PRELIMINARY' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            flagged: {
              $sum: { $cond: [{ $eq: ['$flagged', true] }, 1, 0] },
            },
            reviewed: {
              $sum: { $cond: [{ $eq: ['$status', 'REVIEWED'] }, 1, 0] },
            },
            inProgress: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['IN_PROGRESS', 'DRAFT']] },
                  1,
                  0,
                ],
              },
            },
            needsReview: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $in: ['$status', ['NEEDS_REVIEW', 'COMPLETED']] },
                      { $not: ['$reviewedAt'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      return {
        total: allCounts?.total || 0,
        needsReview: allCounts?.needsReview || 0,
        reviewed: allCounts?.reviewed || 0,
        inProgress: allCounts?.inProgress || 0,
        flagged: allCounts?.flagged || 0,
      };
    } catch {
      return { total: 0, needsReview: 0, reviewed: 0, inProgress: 0, flagged: 0 };
    }
  }

  async findOne(id: string) {
    let query: any = {};
    if (Types.ObjectId.isValid(id)) {
      query.$or = [{ _id: new Types.ObjectId(id) }, { assessmentCode: id }];
    } else {
      query.assessmentCode = id;
    }

    const doc: any = await this.assessmentModel.findOne(query).lean().exec();
    if (!doc) {
      throw new NotFoundException(`Assessment with ID "${id}" not found`);
    }

    // Resolve parent, child, reviewer
    const [parent, child, reviewer] = await Promise.all([
      this.userModel.findById(doc.parentId).select('fullName email phone role').lean().exec(),
      this.childModel.findById(doc.childId).lean().exec(),
      doc.reviewedBy ? this.userModel.findById(doc.reviewedBy).select('fullName email').lean().exec() : null,
    ]);

    const assessmentCode = this.getAssessmentCode(doc);
    const { completion, answered, total: totalQs } = this.calculateCompletion(doc.responses, doc.status);
    const { code: statusCode, label: displayStatus } = this.normalizeStatus(doc.status, doc.reviewedAt);

    // Map questions with responses
    const questionnaire = STANDARDIZED_QUESTIONS.map((q) => {
      const ansKey = String(q.index);
      const answerVal = doc.responses?.[ansKey] || doc.responses?.[q.text] || 'unanswered';
      const answerLabel = ANSWER_LABELS[answerVal.toLowerCase()] || (answerVal === 'unanswered' ? 'Not Answered' : answerVal);

      return {
        index: q.index,
        category: q.category,
        question: q.text,
        explanation: q.explanation,
        answer: answerVal,
        answerLabel,
      };
    });

    const childName = child
      ? `${child.firstName || ''} ${child.lastName || ''}`.trim() || child.preferredName || 'Unnamed Child'
      : 'Unassigned Child';

    return {
      success: true,
      data: {
        id: doc._id.toString(),
        assessmentCode,
        type: doc.type,
        version: doc.version || '1.0',
        submittedAt: doc.completedAt || doc.createdAt,
        formattedDate: this.formatSubmissionDate(doc.completedAt || doc.createdAt),
        status: displayStatus,
        statusCode,
        flagged: Boolean(doc.flagged),
        flagReason: doc.flagReason || null,
        reviewNotes: doc.reviewNotes || null,
        reviewedAt: doc.reviewedAt || null,
        reviewer: reviewer ? { id: reviewer._id.toString(), name: reviewer.fullName, email: reviewer.email } : null,
        completion,
        answeredQuestions: answered,
        totalQuestions: totalQs,
        child: {
          id: doc.childId ? doc.childId.toString() : null,
          name: childName,
          firstName: child?.firstName,
          lastName: child?.lastName,
          dateOfBirth: child?.dateOfBirth,
          gender: child?.gender,
          bloodGroup: child?.bloodGroup,
          diagnosis: child?.diagnosis,
          medicalConditions: child?.medicalConditions,
        },
        parent: {
          id: doc.parentId ? doc.parentId.toString() : null,
          name: parent?.fullName || 'Unassigned Parent',
          email: parent?.email || null,
          phone: parent?.phone || null,
        },
        questionnaire,
      },
    };
  }

  async reviewAssessment(adminId: string, id: string, dto: ReviewAdminAssessmentDto) {
    let query: any = {};
    if (Types.ObjectId.isValid(id)) {
      query.$or = [{ _id: new Types.ObjectId(id) }, { assessmentCode: id }];
    } else {
      query.assessmentCode = id;
    }

    const doc = await this.assessmentModel.findOne(query).exec();
    if (!doc) {
      throw new NotFoundException(`Assessment "${id}" not found`);
    }

    const upperStatus = dto.status.toUpperCase();
    doc.status = upperStatus;
    if (upperStatus === 'REVIEWED') {
      doc.reviewedBy = adminId;
      doc.reviewedAt = new Date();
    } else if (upperStatus === 'NEEDS_REVIEW') {
      doc.reviewedAt = undefined as any;
      doc.reviewedBy = undefined as any;
    }

    if (dto.reviewNotes !== undefined) {
      doc.reviewNotes = dto.reviewNotes;
    }

    await doc.save();
    return this.findOne(doc._id.toString());
  }

  async flagAssessment(adminId: string, id: string, dto: FlagAdminAssessmentDto) {
    let query: any = {};
    if (Types.ObjectId.isValid(id)) {
      query.$or = [{ _id: new Types.ObjectId(id) }, { assessmentCode: id }];
    } else {
      query.assessmentCode = id;
    }

    const doc = await this.assessmentModel.findOne(query).exec();
    if (!doc) {
      throw new NotFoundException(`Assessment "${id}" not found`);
    }

    doc.flagged = Boolean(dto.flagged);
    if (dto.flagReason !== undefined) {
      doc.flagReason = dto.flagReason;
    }

    await doc.save();
    return this.findOne(doc._id.toString());
  }

  private sanitizeCsvCell(value: any): string {
    if (value === null || value === undefined) return '""';
    let str = String(value).trim();
    // Neutralize formula injection risk in spreadsheet programs
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
  }

  async exportCsv(query: ListAdminAssessmentsDto): Promise<string> {
    const listResult = await this.findAll({
      ...query,
      page: 1,
      limit: 5000,
    });

    const headers = [
      'Assessment ID',
      'Child Patient',
      'Parent Name',
      'Parent Email',
      'Submitted Date',
      'Completion %',
      'Status',
      'Flagged',
      'Flag Reason',
    ];

    const rows = (listResult.data || []).map((item) => [
      this.sanitizeCsvCell(item.assessmentCode),
      this.sanitizeCsvCell(item.child?.name),
      this.sanitizeCsvCell(item.parent?.name),
      this.sanitizeCsvCell(item.parent?.email),
      this.sanitizeCsvCell(item.date),
      this.sanitizeCsvCell(`${item.completion}%`),
      this.sanitizeCsvCell(item.status),
      this.sanitizeCsvCell(item.flagged ? 'Yes' : 'No'),
      this.sanitizeCsvCell(item.flagReason || 'None'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\r\n');

    return csvContent;
  }
}
