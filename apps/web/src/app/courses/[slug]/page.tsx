import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  calculateServerCommission,
  formatBdtFromPoisha,
  toBengaliDigits,
} from '@bd-course/shared';
import { Navbar } from '@/components/layout/navbar';
import {
  Badge,
  Card,
  DELIVERY_MODE_BN,
  LEVEL_LABELS_BN,
} from '@/components/ui/primitives';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import { enrollInCourseAction } from '@/app/actions/marketplace';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Lock,
  PlayCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = await readMarketplaceState();
  const course = state.courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const effectivePoisha = course.discountPricePoisha ?? course.pricePoisha;
  const hasDiscount =
    course.discountPricePoisha !== null &&
    course.discountPricePoisha < course.pricePoisha;

  const isEnrolled = state.enrollments.some((e) => e.courseId === course.id);

  const commissionBreakdown = calculateServerCommission(
    effectivePoisha,
    state.commissionRules,
    {
      courseId: course.id,
      instructorId: course.instructor.id,
      categoryId: '11111111-1111-1111-1111-111111111101',
    }
  );

  const hours = Math.max(1, Math.round(course.totalDurationSeconds / 3600));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs text-slate-500">
          <Link href="/courses" className="text-brand-600 hover:underline">
            ← সকল কোর্সে ফিরে যান
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* বাম পাশের বিস্তারিত অংশ */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{course.categoryNameBn}</Badge>
                <Badge variant="neutral">
                  {DELIVERY_MODE_BN[course.deliveryMode]}
                </Badge>
                <Badge variant="neutral">{LEVEL_LABELS_BN[course.level]}</Badge>
                {course.isSampleDevelopmentData && (
                  <Badge variant="warning">ডেভেলপমেন্ট স্যাম্পল কোর্স</Badge>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                {course.titleBn}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                {course.subtitleBn}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                  <UserCheck className="h-4 w-4 text-brand-600" />
                  প্রশিক্ষক:{' '}
                  <Link
                    href={`/instructors/${course.instructor.slug}`}
                    className="text-brand-700 hover:underline"
                  >
                    {course.instructor.fullNameBn ?? course.instructor.fullName}
                  </Link>
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  {toBengaliDigits(course.totalLessonsCount)}টি লেসন
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-400" />
                  মোট {toBengaliDigits(hours)} ঘণ্টা
                </span>
                <span className="inline-flex items-center gap-1">
                  ভর্তি শিক্ষার্থী: {toBengaliDigits(course.enrollmentCount)} জন
                </span>
              </div>
            </Card>

            {/* যা যা শিখবেন */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900">
                এই কোর্স থেকে আপনি যা যা শিখবেন
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.learningObjectives.map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-900">
                  কোর্সটি করার পূর্বশর্ত (Prerequisites)
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* কোর্স সিলেবাস ও লেসন তালিকা */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  কোর্স কারিকুলাম ও লেসনসমূহ
                </h2>
                <span className="text-xs text-slate-500">
                  {toBengaliDigits(course.sections.length)}টি মডিউল •{' '}
                  {toBengaliDigits(course.totalLessonsCount)}টি লেসন
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {course.sections.map((section) => (
                  <div
                    key={section.id}
                    className="overflow-hidden rounded-lg border border-slate-200"
                  >
                    <div className="bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900">
                      {section.title}
                    </div>
                    <ul className="divide-y divide-slate-100 bg-white">
                      {section.lessons.map((lesson) => {
                        const mins = Math.max(
                          1,
                          Math.round(lesson.durationSeconds / 60)
                        );
                        return (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between px-4 py-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {lesson.lessonType === 'video' ? (
                                <PlayCircle className="h-4 w-4 text-brand-600 shrink-0" />
                              ) : lesson.lessonType === 'pdf' ? (
                                <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                              ) : (
                                <HelpCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                              )}
                              <span className="font-medium text-slate-800">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.isFreePreview ? (
                                <Badge variant="brand">ফ্রি প্রিভিউ</Badge>
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              <span className="text-slate-500">
                                {toBengaliDigits(mins)} মিনিট
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ডান পাশের চেকআউট ও ভর্তি কার্ড */}
          <div className="space-y-5">
            <Card className="p-6">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-slate-900">
                  {formatBdtFromPoisha(effectivePoisha, 'bn')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatBdtFromPoisha(course.pricePoisha, 'bn')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                সার্ভার-ভ্যালিডেটেড বাংলাদেশি টাকা (এককালীন পেমেন্ট — ওয়েব ও অ্যান্ড্রয়েড অ্যাপে আজীবন অ্যাক্সেস)
              </p>

              {isEnrolled ? (
                <div className="mt-5 space-y-3">
                  <div className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-xs font-medium text-brand-800">
                    ✓ আপনি ইতোমধ্যে এই কোর্সে ভর্তি হয়েছেন।
                  </div>
                  <Link
                    href="/dashboard"
                    className="block w-full rounded-lg bg-brand-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    স্টুডেন্ট ড্যাশবোর্ডে ক্লাস শুরু করুন →
                  </Link>
                </div>
              ) : (
                <form action={enrollInCourseAction} className="mt-5">
                  <input type="hidden" name="courseSlug" value={course.slug} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    কোর্সে ভর্তি হোন (ডেভ স্যান্ডবক্স চেকআউট)
                  </button>
                </form>
              )}

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>ওয়েবসাইট ও অ্যান্ড্রয়েড অ্যাপে একই অ্যাকাউন্টে অ্যাক্সেস</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>পিডিএফ লেকচার শিট ও কুইজ মূল্যায়ন</span>
                </div>
              </div>

              {/* স্বচ্ছ কমিশন ব্রেকডাউন তথ্য */}
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-[11px] text-slate-600">
                <p className="font-semibold text-slate-800">
                  ব্যাকএন্ড রেভিনিউ স্প্লিট প্রিভিউ (পয়সা লেজার):
                </p>
                <div className="mt-1.5 flex justify-between">
                  <span>প্ল্যাটফর্ম কমিশন ({toBengaliDigits(commissionBreakdown.appliedCommissionBps / 100)}%):</span>
                  <span className="font-medium">
                    {formatBdtFromPoisha(
                      commissionBreakdown.platformCommissionPoisha,
                      'bn'
                    )}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>প্রশিক্ষকের নিট আয়:</span>
                  <span className="font-semibold text-brand-700">
                    {formatBdtFromPoisha(
                      commissionBreakdown.instructorNetPoisha,
                      'bn'
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
