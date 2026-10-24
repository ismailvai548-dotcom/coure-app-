import fs from 'node:fs/promises';
import path from 'node:path';
import {
  bdtToPoisha,
  calculateServerCommission,
  type CommissionRule,
  type CourseCardItem,
  type CourseDeliveryMode,
  type CourseStatus,
  type VerificationStatus,
} from '@bd-course/shared';
import {
  DEV_SAMPLE_CATEGORIES,
  DEV_SAMPLE_COMMISSION_RULES,
  DEV_SAMPLE_COURSES,
  DEV_SAMPLE_INSTRUCTOR_APPLICATIONS,
  type AuditLogRecord,
  type InstructorApplicationRecord,
  type StudentEnrollmentRecord,
} from '../dev-fixtures';

export interface MarketplaceState {
  courses: CourseCardItem[];
  instructorApplications: InstructorApplicationRecord[];
  commissionRules: CommissionRule[];
  enrollments: StudentEnrollmentRecord[];
  auditLogs: AuditLogRecord[];
}

const DATA_FILE_PATH = path.join(
  process.cwd(),
  '.data',
  'dev-marketplace-state.json'
);

function getInitialDefaultState(): MarketplaceState {
  const sampleCourse = DEV_SAMPLE_COURSES[0]!;
  const effectivePoisha =
    sampleCourse.discountPricePoisha ?? sampleCourse.pricePoisha;
  const breakdown = calculateServerCommission(
    effectivePoisha,
    DEV_SAMPLE_COMMISSION_RULES,
    {
      courseId: sampleCourse.id,
      instructorId: sampleCourse.instructor.id,
      categoryId: '11111111-1111-1111-1111-111111111101',
    }
  );

  return {
    courses: DEV_SAMPLE_COURSES,
    instructorApplications: DEV_SAMPLE_INSTRUCTOR_APPLICATIONS,
    commissionRules: DEV_SAMPLE_COMMISSION_RULES,
    enrollments: [
      {
        id: 'enr-sample-01',
        courseId: sampleCourse.id,
        courseSlug: sampleCourse.slug,
        studentNameBn: '[ডেভ স্যাম্পল] আরিফুল ইসলাম (নমুনা শিক্ষার্থী)',
        paidPoisha: breakdown.grossPaidPoisha,
        platformCommissionPoisha: breakdown.platformCommissionPoisha,
        instructorNetPoisha: breakdown.instructorNetPoisha,
        progressPercent: 25,
        completedLessonIds: ['les-phys-1'],
        enrolledAt: '২০২৬-১০-২২',
      },
    ],
    auditLogs: [
      {
        id: 'aud-sample-01',
        actorRoleBn: 'অ্যাডমিন',
        actionBn: 'ডিফল্ট প্ল্যাটফর্ম কমিশন ১০% (১০০০ bps) সক্রিয় করা হয়েছে',
        entityType: 'commission_rule',
        entityTitleBn: '[ডেভ স্যাম্পল] ডিফল্ট প্ল্যাটফর্ম কমিশন (১০%)',
        createdAt: '২০২৬-১০-২০ ১০:৩০',
      },
      {
        id: 'aud-sample-02',
        actorRoleBn: 'অ্যাডমিন',
        actionBn: 'প্রশিক্ষক প্রোফাইল যাচাই ও অনুমোদন করা হয়েছে',
        entityType: 'instructor_profile',
        entityTitleBn: '[ডেভ স্যাম্পল] তানভীর আহমেদ (নমুনা প্রশিক্ষক)',
        createdAt: '২০২৬-১০-২১ ১৪:১৫',
      },
    ],
  };
}

export async function readMarketplaceState(): Promise<MarketplaceState> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(raw) as MarketplaceState;
  } catch {
    const initial = getInitialDefaultState();
    await writeMarketplaceState(initial);
    return initial;
  }
}

async function writeMarketplaceState(state: MarketplaceState): Promise<void> {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

export async function createCourseRecord(input: {
  titleBn: string;
  subtitleBn: string;
  categorySlug: string;
  deliveryMode: CourseDeliveryMode;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  priceBdt: number;
  discountPriceBdt?: number | null;
  learningObjectives: string[];
  prerequisites: string[];
  firstSectionTitleBn: string;
  firstLessonTitleBn: string;
  submitForReview: boolean;
}): Promise<CourseCardItem> {
  const state = await readMarketplaceState();
  const category =
    DEV_SAMPLE_CATEGORIES.find((c) => c.slug === input.categorySlug) ??
    DEV_SAMPLE_CATEGORIES[0]!;

  const pricePoisha = bdtToPoisha(input.priceBdt);
  const discountPricePoisha =
    input.discountPriceBdt && input.discountPriceBdt > 0 && input.discountPriceBdt < input.priceBdt
      ? bdtToPoisha(input.discountPriceBdt)
      : null;

  const slug = `course-${Date.now()}`;
  const status: CourseStatus = input.submitForReview ? 'submitted' : 'draft';

  const newCourse: CourseCardItem = {
    id: `course-id-${Date.now()}`,
    slug,
    titleEn: input.titleBn,
    titleBn: input.titleBn.startsWith('[ডেভ স্যাম্পল]')
      ? input.titleBn
      : `[ডেভ স্যাম্পল] ${input.titleBn}`,
    subtitleEn: input.subtitleBn,
    subtitleBn: input.subtitleBn,
    categorySlug: category.slug,
    categoryNameEn: category.nameEn,
    categoryNameBn: category.nameBn,
    language: 'bn',
    level: input.level,
    deliveryMode: input.deliveryMode,
    pricePoisha,
    discountPricePoisha,
    status,
    instructor: {
      id: 'inst-sample-01',
      slug: 'sample-instructor-physics',
      fullName: '[DEV SAMPLE] Tanvir Ahmed',
      fullNameBn: '[ডেভ স্যাম্পল] তানভীর আহমেদ (নমুনা প্রশিক্ষক)',
      headline: 'নমুনা প্রশিক্ষক — ডেভেলপমেন্ট ডেটা',
      organizationName: 'স্যাম্পল সায়েন্স একাডেমি',
      verificationStatus: 'approved',
      totalStudentsCount: 0,
      averageRating: 0,
    },
    enrollmentCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    totalLessonsCount: 1,
    totalDurationSeconds: 1800,
    learningObjectives:
      input.learningObjectives.length > 0
        ? input.learningObjectives
        : ['কোর্সের মূল বিষয়বস্তু হাতে-কলমে অনুশীলন'],
    prerequisites:
      input.prerequisites.length > 0
        ? input.prerequisites
        : ['প্রাথমিক ধারণা থাকলে যে কেউ শুরু করতে পারবেন'],
    sections: [
      {
        id: `sec-${Date.now()}`,
        title: input.firstSectionTitleBn || 'অধ্যায় ১: সূচনা ও মৌলিক ধারণা',
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: input.firstLessonTitleBn || 'পর্ব ১: কোর্স পরিচিতি (ফ্রি প্রিভিউ)',
            lessonType: 'video',
            durationSeconds: 1800,
            isFreePreview: true,
          },
        ],
      },
    ],
    isSampleDevelopmentData: true,
  };

  state.courses.unshift(newCourse);
  state.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    actorRoleBn: 'প্রশিক্ষক',
    actionBn:
      status === 'submitted'
        ? 'নতুন কোর্স তৈরি করে অ্যাডমিন অনুমোদনের জন্য জমা দেওয়া হয়েছে'
        : 'নতুন কোর্স খসড়া (Draft) হিসেবে সংরক্ষণ করা হয়েছে',
    entityType: 'course',
    entityTitleBn: newCourse.titleBn,
    createdAt: new Date().toLocaleString('bn-BD'),
  });

  await writeMarketplaceState(state);
  return newCourse;
}

export async function reviewCourseSubmissionRecord(
  courseId: string,
  decision: 'publish' | 'reject'
): Promise<void> {
  const state = await readMarketplaceState();
  const target = state.courses.find((c) => c.id === courseId);
  if (!target) return;

  target.status = decision === 'publish' ? 'published' : 'rejected';

  state.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    actorRoleBn: 'অ্যাডমিন',
    actionBn:
      decision === 'publish'
        ? 'কোর্স যাচাই শেষে অনুমোদন ও মার্কেটপ্লেসে প্রকাশ (Published) করা হয়েছে'
        : 'কোর্সটি সংশোধনের জন্য ফেরত (Rejected) পাঠানো হয়েছে',
    entityType: 'course',
    entityTitleBn: target.titleBn,
    createdAt: new Date().toLocaleString('bn-BD'),
  });

  await writeMarketplaceState(state);
}

export async function submitInstructorApplicationRecord(input: {
  fullNameBn: string;
  email: string;
  phone: string;
  headlineBn: string;
  bioBn: string;
  organizationNameBn?: string;
  expertiseTags: string[];
  payoutMethodLabelBn: string;
}): Promise<void> {
  const state = await readMarketplaceState();
  const newApp: InstructorApplicationRecord = {
    id: `inst-${Date.now()}`,
    slug: `instructor-${Date.now()}`,
    fullNameBn: input.fullNameBn.startsWith('[ডেভ স্যাম্পল]')
      ? input.fullNameBn
      : `[ডেভ স্যাম্পল] ${input.fullNameBn}`,
    email: input.email,
    phone: input.phone,
    headlineBn: input.headlineBn,
    bioBn: input.bioBn,
    organizationNameBn: input.organizationNameBn || undefined,
    expertiseTags: input.expertiseTags,
    payoutMethodLabelBn: input.payoutMethodLabelBn,
    verificationStatus: 'pending',
    appliedAt: new Date().toLocaleDateString('bn-BD'),
  };

  state.instructorApplications.unshift(newApp);
  state.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    actorRoleBn: 'প্রশিক্ষক আবেদনকারী',
    actionBn: 'নতুন প্রশিক্ষক ভেরিফিকেশন আবেদন জমা দেওয়া হয়েছে',
    entityType: 'instructor_profile',
    entityTitleBn: newApp.fullNameBn,
    createdAt: new Date().toLocaleString('bn-BD'),
  });

  await writeMarketplaceState(state);
}

export async function reviewInstructorApplicationRecord(
  instructorId: string,
  decision: VerificationStatus
): Promise<void> {
  const state = await readMarketplaceState();
  const app = state.instructorApplications.find((a) => a.id === instructorId);
  if (!app) return;

  app.verificationStatus = decision;
  state.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    actorRoleBn: 'অ্যাডমিন',
    actionBn:
      decision === 'approved'
        ? 'প্রশিক্ষক প্রোফাইল অনুমোদন (Approved) করা হয়েছে'
        : 'প্রশিক্ষক আবেদন বাতিল (Rejected) করা হয়েছে',
    entityType: 'instructor_profile',
    entityTitleBn: app.fullNameBn,
    createdAt: new Date().toLocaleString('bn-BD'),
  });

  await writeMarketplaceState(state);
}

export async function enrollStudentInCourseRecord(
  courseSlug: string
): Promise<void> {
  const state = await readMarketplaceState();
  const course = state.courses.find(
    (c) => c.slug === courseSlug && c.status === 'published'
  );
  if (!course) return;

  const alreadyEnrolled = state.enrollments.some(
    (e) => e.courseId === course.id
  );
  if (alreadyEnrolled) return;

  const effectivePoisha = course.discountPricePoisha ?? course.pricePoisha;
  const breakdown = calculateServerCommission(
    effectivePoisha,
    state.commissionRules,
    {
      courseId: course.id,
      instructorId: course.instructor.id,
      categoryId: '11111111-1111-1111-1111-111111111101',
    }
  );

  state.enrollments.unshift({
    id: `enr-${Date.now()}`,
    courseId: course.id,
    courseSlug: course.slug,
    studentNameBn: '[ডেভ স্যাম্পল] আরিফুল ইসলাম (নমুনা শিক্ষার্থী)',
    paidPoisha: breakdown.grossPaidPoisha,
    platformCommissionPoisha: breakdown.platformCommissionPoisha,
    instructorNetPoisha: breakdown.instructorNetPoisha,
    progressPercent: 0,
    completedLessonIds: [],
    enrolledAt: new Date().toLocaleDateString('bn-BD'),
  });

  course.enrollmentCount += 1;

  state.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    actorRoleBn: 'সিস্টেম লেজার (ডেভ স্যান্ডবক্স)',
    actionBn: `নতুন কোর্স ভর্তি সম্পন্ন — মোট ৳${breakdown.grossPaidPoisha / 100} (প্ল্যাটফর্ম কমিশন: ৳${breakdown.platformCommissionPoisha / 100}, প্রশিক্ষক নিট: ৳${breakdown.instructorNetPoisha / 100})`,
    entityType: 'course_enrollment',
    entityTitleBn: course.titleBn,
    createdAt: new Date().toLocaleString('bn-BD'),
  });

  await writeMarketplaceState(state);
}
