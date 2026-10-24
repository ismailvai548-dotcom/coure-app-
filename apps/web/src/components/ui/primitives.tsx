import React from 'react';
import Link from 'next/link';
import {
  formatBdtFromPoisha,
  toBengaliDigits,
  type CourseCardItem,
  type CourseStatus,
} from '@bd-course/shared';
import { BookOpen, Clock, ShieldCheck, UserCheck } from 'lucide-react';

export function Badge({
  children,
  variant = 'neutral',
}: {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'warning' | 'danger';
}) {
  const styles: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export const DELIVERY_MODE_BN: Record<CourseCardItem['deliveryMode'], string> = {
  recorded: 'রেকর্ডেড কোর্স',
  hybrid: 'হাইব্রিড কোর্স',
  live_cohort: 'লাইভ ব্যাচ',
};

export const LEVEL_LABELS_BN: Record<CourseCardItem['level'], string> = {
  beginner: 'প্রাথমিক (Beginner)',
  intermediate: 'মাধ্যমিক (Intermediate)',
  advanced: 'উচ্চতর (Advanced)',
  all_levels: 'সকল স্তরের জন্য',
};

export const COURSE_STATUS_LABELS_BN: Record<
  CourseStatus,
  { label: string; variant: 'neutral' | 'brand' | 'warning' | 'danger' }
> = {
  draft: { label: 'খসড়া (Draft)', variant: 'neutral' },
  submitted: { label: 'অনুমোদনের অপেক্ষায়', variant: 'warning' },
  approved: { label: 'অনুমোদিত', variant: 'brand' },
  published: { label: 'প্রকাশিত', variant: 'brand' },
  rejected: { label: 'সংশোধনের জন্য ফেরত', variant: 'danger' },
  suspended: { label: 'স্থগিত', variant: 'danger' },
  archived: { label: 'আর্কাইভড', variant: 'neutral' },
};

export function CourseCard({
  course,
}: {
  course: CourseCardItem;
}) {
  const effectivePoisha = course.discountPricePoisha ?? course.pricePoisha;
  const hasDiscount =
    course.discountPricePoisha !== null &&
    course.discountPricePoisha < course.pricePoisha;

  const hours = Math.max(1, Math.round(course.totalDurationSeconds / 3600));

  return (
    <Card className="flex flex-col justify-between p-5 transition-colors hover:border-brand-600">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="brand">{course.categoryNameBn}</Badge>
          {course.isSampleDevelopmentData && (
            <Badge variant="warning">ডেভ স্যাম্পল</Badge>
          )}
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="block text-base font-semibold leading-snug text-slate-900 hover:text-brand-600"
        >
          {course.titleBn}
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {course.subtitleBn}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <UserCheck className="h-3.5 w-3.5 text-brand-600 shrink-0" />
          <Link
            href={`/instructors/${course.instructor.slug}`}
            className="truncate font-medium text-slate-800 hover:text-brand-600 hover:underline"
          >
            {course.instructor.fullNameBn ?? course.instructor.fullName}
          </Link>
        </div>

        <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {toBengaliDigits(course.totalLessonsCount)}টি লেসন
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {toBengaliDigits(hours)} ঘণ্টা
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            {DELIVERY_MODE_BN[course.deliveryMode]}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="text-lg font-bold text-slate-900">
            {formatBdtFromPoisha(effectivePoisha, 'bn')}
          </span>
          {hasDiscount && (
            <span className="ml-2 text-xs text-slate-400 line-through">
              {formatBdtFromPoisha(course.pricePoisha, 'bn')}
            </span>
          )}
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          বিস্তারিত ও ভর্তি
        </Link>
      </div>
    </Card>
  );
}
