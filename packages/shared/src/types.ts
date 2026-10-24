/**
 * Shared Domain Types for Bangladesh Course Marketplace
 * Used across Website, Instructor Dashboard, Admin Dashboard, and Android App.
 */

export type AppRole = 'guest' | 'student' | 'instructor' | 'organization_admin' | 'admin';

export type VerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';

export type CourseStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'suspended'
  | 'archived';

export type CourseDeliveryMode = 'recorded' | 'hybrid' | 'live_cohort';

export type LessonType =
  | 'video'
  | 'text'
  | 'pdf'
  | 'quiz'
  | 'assignment'
  | 'live_session_placeholder';

export type CommissionScope =
  | 'platform_default'
  | 'category'
  | 'organization'
  | 'instructor'
  | 'course'
  | 'instructor_promo_attribution';

export interface CommissionRule {
  id: string;
  name: string;
  scope: CommissionScope;
  targetCategoryId?: string | null;
  targetOrganizationId?: string | null;
  targetInstructorId?: string | null;
  targetCourseId?: string | null;
  /** Basis points (1000 bps = 10.00%). Never hardcoded in business logic. */
  commissionBps: number;
  minAllowedBps: number;
  maxAllowedBps: number;
  settlementHoldDays: number;
  priority: number;
  isActive: boolean;
}

export interface CategorySummary {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconName: string;
  courseCount: number;
}

export interface InstructorSummary {
  id: string;
  slug: string;
  fullName: string;
  fullNameBn?: string;
  headline: string;
  headlineBn?: string;
  organizationName?: string;
  verificationStatus: VerificationStatus;
  totalStudentsCount: number;
  averageRating: number;
}

export interface LessonSummary {
  id: string;
  title: string;
  lessonType: LessonType;
  durationSeconds: number;
  isFreePreview: boolean;
}

export interface CourseSectionSummary {
  id: string;
  title: string;
  lessons: LessonSummary[];
}

export interface CourseCardItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  categorySlug: string;
  categoryNameEn: string;
  categoryNameBn: string;
  language: 'bn' | 'en' | 'mixed';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  deliveryMode: CourseDeliveryMode;
  pricePoisha: number;
  discountPricePoisha: number | null;
  status: CourseStatus;
  instructor: InstructorSummary;
  enrollmentCount: number;
  ratingAvg: number;
  ratingCount: number;
  totalLessonsCount: number;
  totalDurationSeconds: number;
  learningObjectives: string[];
  prerequisites: string[];
  sections: CourseSectionSummary[];
  isSampleDevelopmentData: boolean;
}
