import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import {
  Badge,
  Card,
  COURSE_STATUS_LABELS_BN,
} from '@/components/ui/primitives';
import {
  calculateServerCommission,
  formatBdtFromPoisha,
  toBengaliDigits,
} from '@bd-course/shared';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import { CheckCircle2, PlusCircle, UserPlus } from 'lucide-react';

export default async function InstructorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; applied?: string }>;
}) {
  const params = await searchParams;
  const state = await readMarketplaceState();

  const totalGrossPoisha = state.enrollments.reduce(
    (sum, e) => sum + e.paidPoisha,
    0
  );
  const totalCommissionPoisha = state.enrollments.reduce(
    (sum, e) => sum + e.platformCommissionPoisha,
    0
  );
  const totalInstructorNetPoisha = state.enrollments.reduce(
    (sum, e) => sum + e.instructorNetPoisha,
    0
  );

  const sampleCourse = state.courses[0]!;
  const effectivePrice =
    sampleCourse.discountPricePoisha ?? sampleCourse.pricePoisha;

  const standardBreakdown = calculateServerCommission(
    effectivePrice,
    state.commissionRules,
    {
      courseId: sampleCourse.id,
      instructorId: sampleCourse.instructor.id,
      categoryId: '11111111-1111-1111-1111-111111111101',
      isInstructorAttributedSale: false,
    }
  );

  const promoBreakdown = calculateServerCommission(
    effectivePrice,
    state.commissionRules,
    {
      courseId: sampleCourse.id,
      instructorId: sampleCourse.instructor.id,
      categoryId: '11111111-1111-1111-1111-111111111101',
      isInstructorAttributedSale: true,
    }
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="brand">প্রশিক্ষক ড্যাশবোর্ড (ধাপ ২ মার্কেটপ্লেস)</Badge>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              প্রশিক্ষক স্টুডিও, কোর্স ব্যবস্থাপনা ও আয় বিবরণী
            </h1>
            <p className="text-xs text-slate-600">
              নতুন কোর্স তৈরি করুন, অ্যাডমিন অনুমোদনের স্ট্যাটাস ট্র্যাক করুন এবং বিক্রয় ও কমিশনের হিসাব দেখুন।
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/instructor/apply"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <UserPlus className="h-3.5 w-3.5 text-brand-600" />
              প্রশিক্ষক ভেরিফিকেশন আবেদন
            </Link>
            <Link
              href="/instructor/courses/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              নতুন কোর্স তৈরি করুন
            </Link>
          </div>
        </div>

        {params.created === '1' && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 p-4 text-xs font-semibold text-brand-800">
            <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
            <span>
              আপনার নতুন কোর্সটি সফলভাবে সংরক্ষিত হয়েছে! অ্যাডমিন প্যানেল (`/admin`) থেকে এটি অনুমোদন ও প্রকাশ করতে পারবেন।
            </span>
          </div>
        )}

        {params.applied === '1' && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 p-4 text-xs font-semibold text-brand-800">
            <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
            <span>
              আপনার প্রশিক্ষক ভেরিফিকেশন আবেদনটি জমা হয়েছে! অ্যাডমিন প্যানেল (`/admin`) থেকে অনুমোদন করা যাবে।
            </span>
          </div>
        )}

        {/* আয়ের সারসংক্ষেপ কার্ড */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <span className="text-xs font-medium text-slate-500">
              মোট কোর্স বিক্রয় (Gross Sales)
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatBdtFromPoisha(totalGrossPoisha, 'bn')}
            </p>
            <span className="mt-1 block text-[11px] text-slate-500">
              মোট ভর্তি: {toBengaliDigits(state.enrollments.length)} জন শিক্ষার্থী
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-slate-500">
              প্ল্যাটফর্ম কমিশন কর্তন
            </span>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {formatBdtFromPoisha(totalCommissionPoisha, 'bn')}
            </p>
            <span className="mt-1 block text-[11px] text-slate-500">
              কনফিগারযোগ্য ১০% ডিফল্ট রেট অনুযায়ী
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-slate-500">
              প্রশিক্ষকের নিট প্রাপ্য আয় (Net Earnings)
            </span>
            <p className="mt-2 text-2xl font-bold text-brand-600">
              {formatBdtFromPoisha(totalInstructorNetPoisha, 'bn')}
            </p>
            <span className="mt-1 block text-[11px] text-slate-500">
              ৭ দিনের সেটেলমেন্ট হোল্ড শেষে উত্তোলনযোগ্য
            </span>
          </Card>
        </div>

        {/* কোর্স তালিকা ও অনুমোদনের অবস্থা */}
        <Card className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">
              কোর্স তালিকা ও প্রকাশনার অবস্থা ({toBengaliDigits(state.courses.length)}টি)
            </h2>
            <Link
              href="/instructor/courses/new"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              + নতুন কোর্স যুক্ত করুন
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">কোর্সের শিরোনাম</th>
                  <th className="px-6 py-3 font-semibold">ক্যাটাগরি</th>
                  <th className="px-6 py-3 font-semibold">বিক্রয়মূল্য</th>
                  <th className="px-6 py-3 font-semibold">ভর্তি শিক্ষার্থী</th>
                  <th className="px-6 py-3 font-semibold">অবস্থা (Status)</th>
                  <th className="px-6 py-3 font-semibold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {state.courses.map((course) => {
                  const statusInfo = COURSE_STATUS_LABELS_BN[course.status];
                  const effective =
                    course.discountPricePoisha ?? course.pricePoisha;
                  return (
                    <tr key={course.id}>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">
                        {course.titleBn}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {course.categoryNameBn}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        {formatBdtFromPoisha(effective, 'bn')}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {toBengaliDigits(course.enrollmentCount)} জন
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="font-semibold text-brand-600 hover:underline"
                        >
                          প্রিভিউ দেখুন
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* সার্ভার-ভিত্তিক কমিশন হিসাব প্রদর্শনী */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900">
              মার্কেটপ্লেস সাধারণ বিক্রয় হিসাব (ডিফল্ট ১০% কমিশন নিয়ম)
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              সার্ভার ব্যাকএন্ডে পূর্ণসংখ্যা পয়সা (Poisha) ব্যবহার করে স্বয়ংক্রিয়ভাবে হিসাবকৃত।
            </p>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">কোর্সের মোট বিক্রয়মূল্য:</dt>
                <dd className="font-semibold">
                  {formatBdtFromPoisha(standardBreakdown.grossPaidPoisha, 'bn')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">
                  প্ল্যাটফর্ম কমিশন ({toBengaliDigits(standardBreakdown.appliedCommissionBps / 100)}%):
                </dt>
                <dd className="text-rose-600 font-medium">
                  -
                  {formatBdtFromPoisha(
                    standardBreakdown.platformCommissionPoisha,
                    'bn'
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2.5">
                <dt className="font-bold text-slate-900">
                  প্রশিক্ষকের নিট প্রাপ্য আয়:
                </dt>
                <dd className="font-bold text-brand-600">
                  {formatBdtFromPoisha(
                    standardBreakdown.instructorNetPoisha,
                    'bn'
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900">
              প্রশিক্ষকের নিজস্ব প্রোমো/কুপন বিক্রয় হিসাব (৫% বিশেষ কমিশন নিয়ম)
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              হার্ডকোড ছাড়া অ্যাডমিন ড্যাশবোর্ড থেকে কনফিগারযোগ্য ডায়নামিক কমিশন নিয়ম।
            </p>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">কোর্সের মোট বিক্রয়মূল্য:</dt>
                <dd className="font-semibold">
                  {formatBdtFromPoisha(promoBreakdown.grossPaidPoisha, 'bn')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">
                  প্ল্যাটফর্ম কমিশন ({toBengaliDigits(promoBreakdown.appliedCommissionBps / 100)}%):
                </dt>
                <dd className="text-rose-600 font-medium">
                  -
                  {formatBdtFromPoisha(
                    promoBreakdown.platformCommissionPoisha,
                    'bn'
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2.5">
                <dt className="font-bold text-slate-900">
                  প্রশিক্ষকের নিট প্রাপ্য আয়:
                </dt>
                <dd className="font-bold text-brand-600">
                  {formatBdtFromPoisha(promoBreakdown.instructorNetPoisha, 'bn')}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </main>
    </div>
  );
}
