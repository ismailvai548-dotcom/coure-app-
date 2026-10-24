import React from 'react';
import Link from 'next/link';
import { formatBdtFromPoisha, toBengaliDigits } from '@bd-course/shared';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card } from '@/components/ui/primitives';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Receipt,
  Smartphone,
} from 'lucide-react';

export default async function StudentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ enrolled?: string }>;
}) {
  const params = await searchParams;
  const state = await readMarketplaceState();

  const enrolledItems = state.enrollments.map((enr) => {
    const course = state.courses.find((c) => c.id === enr.courseId);
    return { enrollment: enr, course };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="brand">স্টুডেন্ট ড্যাশবোর্ড ও কোর্স লাইব্রেরি</Badge>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              আমার ভর্তি হওয়া কোর্সসমূহ (
              {toBengaliDigits(enrolledItems.length)}টি)
            </h1>
            <p className="text-xs text-slate-600">
              ওয়েবসাইটে কেনা যেকোনো কোর্স একই অ্যাকাউন্টে অ্যান্ড্রয়েড অ্যাপেও তাৎক্ষণিক সিঙ্ক হবে।
            </p>
          </div>
          <Link
            href="/courses"
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            + নতুন কোর্স খুঁজুন
          </Link>
        </div>

        {params.enrolled === '1' && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 p-4 text-xs font-semibold text-brand-800">
            <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
            <span>
              অভিনন্দন! আপনার কোর্স ভর্তি সফলভাবে সম্পন্ন হয়েছে এবং স্টুডেন্ট লাইব্রেরিতে যুক্ত করা হয়েছে।
            </span>
          </div>
        )}

        {/* ভর্তি হওয়া কোর্সের কার্ডসমূহ */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {enrolledItems.map(({ enrollment, course }) => {
            if (!course) return null;
            return (
              <Card key={enrollment.id} className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="brand">{course.categoryNameBn}</Badge>
                  <span className="text-xs text-slate-500">
                    ভর্তির তারিখ: {enrollment.enrolledAt}
                  </span>
                </div>

                <h2 className="mt-3 text-base font-bold text-slate-900">
                  {course.titleBn}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  প্রশিক্ষক:{' '}
                  {course.instructor.fullNameBn ?? course.instructor.fullName}
                </p>

                {/* প্রগ্রেস বার */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>শেখার অগ্রগতি</span>
                    <span>{toBengaliDigits(enrollment.progressPercent)}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{
                        width: `${Math.max(8, enrollment.progressPercent)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <BookOpen className="h-3.5 w-3.5 text-brand-600" />
                    {toBengaliDigits(course.totalLessonsCount)}টি লেসন
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                  >
                    <PlayCircle className="h-4 w-4" />
                    কোর্স কন্টেন্ট ও সিলেবাস দেখুন
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* পেমেন্ট ও রিসিট হিস্ট্রি */}
        <Card className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-900">
                কোর্স ক্রয় ও পেমেন্ট রিসিট ইতিহাস
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Smartphone className="h-3.5 w-3.5 text-brand-600" />
              অ্যান্ড্রয়েড অ্যাপে সিঙ্ককৃত
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">রিসিট আইডি</th>
                  <th className="px-6 py-3 font-semibold">কোর্সের নাম</th>
                  <th className="px-6 py-3 font-semibold">পরিশোধিত মূল্য</th>
                  <th className="px-6 py-3 font-semibold">তারিখ</th>
                  <th className="px-6 py-3 font-semibold">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {enrolledItems.map(({ enrollment, course }) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {enrollment.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {course?.titleBn ?? enrollment.courseSlug}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {formatBdtFromPoisha(enrollment.paidPoisha, 'bn')}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {enrollment.enrolledAt}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="brand">ভেরিফাইড ও সক্রিয়</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
