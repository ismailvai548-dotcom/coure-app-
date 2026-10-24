'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { CourseDeliveryMode } from '@bd-course/shared';
import {
  createCourseRecord,
  enrollStudentInCourseRecord,
  reviewCourseSubmissionRecord,
  reviewInstructorApplicationRecord,
  submitInstructorApplicationRecord,
} from '@/lib/store/marketplace-store';

export async function createCourseAction(formData: FormData) {
  const titleBn = String(formData.get('titleBn') ?? '').trim();
  const subtitleBn = String(formData.get('subtitleBn') ?? '').trim();
  const categorySlug = String(formData.get('categorySlug') ?? 'academic-hsc-ssc');
  const deliveryMode = String(
    formData.get('deliveryMode') ?? 'recorded'
  ) as CourseDeliveryMode;
  const level = String(formData.get('level') ?? 'beginner') as
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'all_levels';
  const priceBdt = Number(formData.get('priceBdt') ?? 1000);
  const discountPriceRaw = formData.get('discountPriceBdt');
  const discountPriceBdt = discountPriceRaw ? Number(discountPriceRaw) : null;

  const objectivesRaw = String(formData.get('learningObjectives') ?? '');
  const prerequisitesRaw = String(formData.get('prerequisites') ?? '');
  const firstSectionTitleBn = String(
    formData.get('firstSectionTitleBn') ?? ''
  ).trim();
  const firstLessonTitleBn = String(
    formData.get('firstLessonTitleBn') ?? ''
  ).trim();
  const submitMode = String(formData.get('submitMode') ?? 'submitted');

  if (!titleBn || !subtitleBn || Number.isNaN(priceBdt) || priceBdt < 0) {
    throw new Error('কোর্সের শিরোনাম, সংক্ষিপ্ত বিবরণ এবং সঠিক মূল্য প্রদান করুন।');
  }

  await createCourseRecord({
    titleBn,
    subtitleBn,
    categorySlug,
    deliveryMode,
    level,
    priceBdt,
    discountPriceBdt,
    learningObjectives: objectivesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    prerequisites: prerequisitesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    firstSectionTitleBn,
    firstLessonTitleBn,
    submitForReview: submitMode === 'submitted',
  });

  revalidatePath('/');
  revalidatePath('/courses');
  revalidatePath('/instructor');
  revalidatePath('/admin');
  redirect('/instructor?created=1');
}

export async function reviewCourseAction(formData: FormData) {
  const courseId = String(formData.get('courseId') ?? '');
  const decision = String(formData.get('decision') ?? 'publish') as
    | 'publish'
    | 'reject';

  if (courseId) {
    await reviewCourseSubmissionRecord(courseId, decision);
  }

  revalidatePath('/');
  revalidatePath('/courses');
  revalidatePath('/instructor');
  revalidatePath('/admin');
}

export async function submitInstructorApplicationAction(formData: FormData) {
  const fullNameBn = String(formData.get('fullNameBn') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const headlineBn = String(formData.get('headlineBn') ?? '').trim();
  const bioBn = String(formData.get('bioBn') ?? '').trim();
  const organizationNameBn = String(
    formData.get('organizationNameBn') ?? ''
  ).trim();
  const expertiseRaw = String(formData.get('expertiseTags') ?? '');
  const payoutMethodLabelBn = String(
    formData.get('payoutMethodLabelBn') ?? 'ব্যাংক ট্রান্সফার (নমুনা হিসাব)'
  ).trim();

  if (!fullNameBn || !email || !headlineBn) {
    throw new Error('অনুগ্রহ করে নাম, ইমেইল এবং পেশাগত শিরোনাম পূরণ করুন।');
  }

  await submitInstructorApplicationRecord({
    fullNameBn,
    email,
    phone,
    headlineBn,
    bioBn,
    organizationNameBn,
    expertiseTags: expertiseRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    payoutMethodLabelBn,
  });

  revalidatePath('/instructor');
  revalidatePath('/admin');
  redirect('/instructor?applied=1');
}

export async function reviewInstructorAction(formData: FormData) {
  const instructorId = String(formData.get('instructorId') ?? '');
  const decision = String(formData.get('decision') ?? 'approved') as
    | 'approved'
    | 'rejected';

  if (instructorId) {
    await reviewInstructorApplicationRecord(instructorId, decision);
  }

  revalidatePath('/instructor');
  revalidatePath('/admin');
}

export async function enrollInCourseAction(formData: FormData) {
  const courseSlug = String(formData.get('courseSlug') ?? '');
  if (courseSlug) {
    await enrollStudentInCourseRecord(courseSlug);
  }

  revalidatePath('/');
  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath('/dashboard');
  revalidatePath('/instructor');
  revalidatePath('/admin');
  redirect('/dashboard?enrolled=1');
}
