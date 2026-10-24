import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card } from '@/components/ui/primitives';
import { DEV_SAMPLE_CATEGORIES } from '@/lib/dev-fixtures';
import { createCourseAction } from '@/app/actions/marketplace';

export default function NewCoursePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs">
          <Link href="/instructor" className="text-brand-600 hover:underline">
            ← প্রশিক্ষক ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
          <Badge variant="brand">প্রশিক্ষক কোর্স নির্মাতা (Course Builder)</Badge>
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            নতুন কোর্স তৈরি ও জমা দিন
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            কোর্সের তথ্য, বাংলাদেশি টাকায় (৳) মূল্য এবং প্রথম মডিউল যুক্ত করে অ্যাডমিন অনুমোদনের জন্য জমা দিন।
          </p>

          <form action={createCourseAction} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                কোর্সের শিরোনাম (বাংলায়) *
              </label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: এইচএসসি উচ্চতর গণিত ১ম পত্র মাস্টারক্লাস"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                কোর্সের সংক্ষিপ্ত বিবরণ (Subtitle) *
              </label>
              <input
                type="text"
                name="subtitleBn"
                required
                placeholder="ম্যাট্রিক্স, ভেক্টর, সরলরেখা ও ক্যালকুলাসের পূর্ণাঙ্গ বোর্ড এবং ভর্তি প্রস্তুতি"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ক্যাটাগরি নির্বাচন করুন *
                </label>
                <select
                  name="categorySlug"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
                >
                  {DEV_SAMPLE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  কোর্সের ধরন *
                </label>
                <select
                  name="deliveryMode"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
                >
                  <option value="recorded">রেকর্ডেড কোর্স</option>
                  <option value="hybrid">হাইব্রিড কোর্স</option>
                  <option value="live_cohort">লাইভ ব্যাচ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  শিক্ষার স্তর (Level) *
                </label>
                <select
                  name="level"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
                >
                  <option value="beginner">প্রাথমিক (Beginner)</option>
                  <option value="intermediate">মাধ্যমিক (Intermediate)</option>
                  <option value="advanced">উচ্চতর (Advanced)</option>
                  <option value="all_levels">সকল স্তরের জন্য</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  নিয়মিত মূল্য (BDT ৳) *
                </label>
                <input
                  type="number"
                  name="priceBdt"
                  required
                  min={0}
                  defaultValue={1500}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ডিসকাউন্ট মূল্য (BDT ৳ — ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  name="discountPriceBdt"
                  min={0}
                  defaultValue={1200}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                কোর্স থেকে যা যা শিখবেন (প্রতি লাইনে একটি করে লিখুন)
              </label>
              <textarea
                name="learningObjectives"
                rows={3}
                defaultValue={
                  'বোর্ড পরীক্ষার সৃজনশীল ও এমসিকিউ প্রশ্নের নির্ভুল সমাধান\nভর্তি পরীক্ষার গাণিতিক শর্টকাট ও কনসেপ্ট বিল্ডিং'
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                কোর্সের পূর্বশর্ত (প্রতি লাইনে একটি করে লিখুন)
              </label>
              <textarea
                name="prerequisites"
                rows={2}
                defaultValue="এসএসসি পর্যায়ের সাধারণ গণিতের মৌলিক ধারণা"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <h2 className="text-xs font-bold text-slate-900">
                প্রথম কারিকুলাম মডিউল ও ফ্রি প্রিভিউ লেসন
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  মডিউল ১-এর শিরোনাম
                </label>
                <input
                  type="text"
                  name="firstSectionTitleBn"
                  defaultValue="অধ্যায় ১: সূচনা ও মৌলিক ধারণা"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  লেসন ১-এর শিরোনাম (ফ্রি প্রিভিউ)
                </label>
                <input
                  type="text"
                  name="firstLessonTitleBn"
                  defaultValue="পর্ব ১: কোর্স পরিচিতি ও গাইডলাইন (ফ্রি প্রিভিউ)"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                প্রকাশনার মোড নির্বাচন করুন
              </label>
              <select
                name="submitMode"
                defaultValue="submitted"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-600 focus:outline-none"
              >
                <option value="submitted">
                  অ্যাডমিন অনুমোদনের জন্য জমা দিন (Submit for Review)
                </option>
                <option value="draft">খসড়া হিসেবে সংরক্ষণ করুন (Save as Draft)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/instructor"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                কোর্স সংরক্ষণ ও জমা দিন
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
