import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import {
  Badge,
  Card,
  COURSE_STATUS_LABELS_BN,
} from '@/components/ui/primitives';
import { formatBdtFromPoisha, toBengaliDigits } from '@bd-course/shared';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import {
  reviewCourseAction,
  reviewInstructorAction,
} from '@/app/actions/marketplace';

const SCOPE_LABELS_BN: Record<string, string> = {
  platform_default: 'প্ল্যাটফর্ম ডিফল্ট',
  instructor_promo_attribution: 'প্রশিক্ষক কুপন অ্যাট্রিবিউশন',
  category: 'ক্যাটাগরি ভিত্তিক',
  organization: 'প্রতিষ্ঠান ভিত্তিক',
  instructor: 'নির্দিষ্ট প্রশিক্ষক',
  course: 'নির্দিষ্ট কোর্স',
};

export default async function AdminDashboardPage() {
  const state = await readMarketplaceState();

  const pendingCourses = state.courses.filter((c) => c.status === 'submitted');
  const pendingInstructors = state.instructorApplications.filter(
    (a) => a.verificationStatus === 'pending'
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="brand">অ্যাডমিন গভর্ন্যান্স প্যানেল (ধাপ ২ মার্কেটপ্লেস)</Badge>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              কোর্স অনুমোদন, প্রশিক্ষক যাচাই, কমিশন নীতিমালা ও অডিট লেজার
            </h1>
            <p className="text-xs text-slate-600">
              সকল অ্যাডমিন সিদ্ধান্ত অপরিবর্তনীয় (Append-Only) অডিট লগে স্বয়ংক্রিয়ভাবে রেকর্ড হয়।
            </p>
          </div>
          <Badge variant="warning">ডেভেলপমেন্ট গভর্ন্যান্স কনসোল</Badge>
        </div>

        {/* ১. অপেক্ষমাণ কোর্স অনুমোদন কিউ */}
        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">
              অনুমোদনের অপেক্ষায় থাকা কোর্সসমূহ (
              {toBengaliDigits(pendingCourses.length)}টি)
            </h2>
            <Badge variant={pendingCourses.length > 0 ? 'warning' : 'brand'}>
              {pendingCourses.length > 0
                ? 'অ্যাডমিন রিভিউ প্রয়োজন'
                : 'সকল কোর্স যাচাই সম্পন্ন'}
            </Badge>
          </div>

          {pendingCourses.length === 0 ? (
            <div className="p-6 text-xs text-slate-500">
              বর্তমানে অনুমোদনের অপেক্ষায় কোনো নতুন কোর্স নেই। আপনি{' '}
              <code>/instructor/courses/new</code> থেকে নতুন কোর্স সাবমিট করে এখানে টেস্ট করতে পারেন।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 font-semibold">কোর্সের নাম</th>
                    <th className="px-6 py-3 font-semibold">প্রশিক্ষক</th>
                    <th className="px-6 py-3 font-semibold">ক্যাটাগরি</th>
                    <th className="px-6 py-3 font-semibold">মূল্য</th>
                    <th className="px-6 py-3 font-semibold">সিদ্ধান্ত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingCourses.map((course) => {
                    const effective =
                      course.discountPricePoisha ?? course.pricePoisha;
                    return (
                      <tr key={course.id}>
                        <td className="px-6 py-3.5 font-semibold text-slate-900">
                          {course.titleBn}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">
                          {course.instructor.fullNameBn ??
                            course.instructor.fullName}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">
                          {course.categoryNameBn}
                        </td>
                        <td className="px-6 py-3.5 font-bold text-slate-900">
                          {formatBdtFromPoisha(effective, 'bn')}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <form action={reviewCourseAction}>
                              <input
                                type="hidden"
                                name="courseId"
                                value={course.id}
                              />
                              <input
                                type="hidden"
                                name="decision"
                                value="publish"
                              />
                              <button
                                type="submit"
                                className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                              >
                                অনুমোদন ও প্রকাশ করুন
                              </button>
                            </form>
                            <form action={reviewCourseAction}>
                              <input
                                type="hidden"
                                name="courseId"
                                value={course.id}
                              />
                              <input
                                type="hidden"
                                name="decision"
                                value="reject"
                              />
                              <button
                                type="submit"
                                className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                              >
                                ফেরত পাঠান
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ২. প্রশিক্ষক ভেরিফিকেশন আবেদনসমূহ */}
        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">
              প্রশিক্ষক ভেরিফিকেশন তালিকা (অপেক্ষমাণ:{' '}
              {toBengaliDigits(pendingInstructors.length)} জন)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">প্রশিক্ষকের নাম</th>
                  <th className="px-6 py-3 font-semibold">পেশাগত শিরোনাম</th>
                  <th className="px-6 py-3 font-semibold">পেআউট মাধ্যম</th>
                  <th className="px-6 py-3 font-semibold">অবস্থা</th>
                  <th className="px-6 py-3 font-semibold">সিদ্ধান্ত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {state.instructorApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {app.fullNameBn}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {app.headlineBn}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {app.payoutMethodLabelBn}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        variant={
                          app.verificationStatus === 'approved'
                            ? 'brand'
                            : app.verificationStatus === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {app.verificationStatus === 'approved'
                          ? 'অনুমোদিত'
                          : app.verificationStatus === 'pending'
                          ? 'যাচাইয়ের অপেক্ষায়'
                          : 'বাতিলকৃত'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      {app.verificationStatus === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <form action={reviewInstructorAction}>
                            <input
                              type="hidden"
                              name="instructorId"
                              value={app.id}
                            />
                            <input
                              type="hidden"
                              name="decision"
                              value="approved"
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
                            >
                              অনুমোদন করুন
                            </button>
                          </form>
                          <form action={reviewInstructorAction}>
                            <input
                              type="hidden"
                              name="instructorId"
                              value={app.id}
                            />
                            <input
                              type="hidden"
                              name="decision"
                              value="rejected"
                            />
                            <button
                              type="submit"
                              className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                            >
                              বাতিল করুন
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-slate-400">সিদ্ধান্ত গৃহীত</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ৩. সক্রিয় কমিশন রুলসমূহ */}
        <Card className="mt-6 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">
              সক্রিয় কমিশন রুলসমূহ (কনফিগারযোগ্য ৫%–২০% সীমা)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">কমিশন নিয়মের নাম</th>
                  <th className="px-6 py-3 font-semibold">প্রয়োগের ক্ষেত্র</th>
                  <th className="px-6 py-3 font-semibold">কমিশন হার (%)</th>
                  <th className="px-6 py-3 font-semibold">অনুমোদিত সীমা</th>
                  <th className="px-6 py-3 font-semibold">সেটেলমেন্ট হোল্ড সময়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {state.commissionRules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {rule.name}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="neutral">
                        {SCOPE_LABELS_BN[rule.scope] ?? rule.scope}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-brand-700">
                      {toBengaliDigits((rule.commissionBps / 100).toFixed(0))}% (
                      {toBengaliDigits(rule.commissionBps)} bps)
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {toBengaliDigits((rule.minAllowedBps / 100).toFixed(0))}% –{' '}
                      {toBengaliDigits((rule.maxAllowedBps / 100).toFixed(0))}%
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {toBengaliDigits(rule.settlementHoldDays)} দিন
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ৪. অপরিবর্তনীয় অডিট লগ (Append-Only Audit Logs) */}
        <Card className="mt-6 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">
              সিস্টেম ও আর্থিক অডিট লগ (`audit_logs` — অপরিবর্তনীয় রেকর্ড)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">সময়</th>
                  <th className="px-6 py-3 font-semibold">ভূমিকা (Role)</th>
                  <th className="px-6 py-3 font-semibold">কোর্স / প্রোফাইল</th>
                  <th className="px-6 py-3 font-semibold">কার্যক্রম বিবরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {state.auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-3 text-slate-500">{log.createdAt}</td>
                    <td className="px-6 py-3">
                      <Badge variant="neutral">{log.actorRoleBn}</Badge>
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      {log.entityTitleBn}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{log.actionBn}</td>
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
