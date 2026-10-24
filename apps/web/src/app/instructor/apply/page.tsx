import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card } from '@/components/ui/primitives';
import { submitInstructorApplicationAction } from '@/app/actions/marketplace';

export default function InstructorApplyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs">
          <Link href="/instructor" className="text-brand-600 hover:underline">
            ← প্রশিক্ষক ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
          <Badge variant="brand">প্রশিক্ষক ও প্রতিষ্ঠান রেজিস্ট্রেশন</Badge>
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            নতুন প্রশিক্ষক ভেরিফিকেশন আবেদন ফর্ম
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            আপনার প্রোফাইল, দক্ষতা এবং পেআউট গ্রহণের মাধ্যম উল্লেখ করে আবেদন জমা দিন। অ্যাডমিন যাচাই শেষে অনুমোদন করবেন।
          </p>

          <form
            action={submitInstructorApplicationAction}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                পূর্ণ নাম (বাংলায়) *
              </label>
              <input
                type="text"
                name="fullNameBn"
                required
                placeholder="যেমন: সাদিয়া সুলতানা"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ইমেইল ঠিকানা *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="instructor@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  মোবাইল নম্বর (+৮৮০) *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+8801700000000"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                পেশাগত পরিচয় বা শিরোনাম (Headline) *
              </label>
              <input
                type="text"
                name="headlineBn"
                required
                placeholder="যেমন: ডিজিটাল মার্কেটিং ও এআই অটোমেশন ট্রেইনার"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                কোচিং সেন্টার / প্রতিষ্ঠান বা এজেন্সির নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                name="organizationNameBn"
                placeholder="যেমন: ফিউচার স্কিল একাডেমি বিডি"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                দক্ষতার বিষয়সমূহ (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                name="expertiseTags"
                defaultValue="Digital Marketing, SEO, AI Workflows"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                পেআউট গ্রহণের মাধ্যম (ব্যাংক / বিকাশ / নগদ সারাংশ)
              </label>
              <input
                type="text"
                name="payoutMethodLabelBn"
                defaultValue="ব্যাংক ট্রান্সফার (ব্র্যাক ব্যাংক — ****৭৭২১)"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                সংক্ষিপ্ত জীবনী ও অভিজ্ঞতা
              </label>
              <textarea
                name="bioBn"
                rows={3}
                defaultValue="গত ৫ বছর ধরে বাংলাদেশের শিক্ষার্থীদের ব্যবহারিক প্রজেক্টের মাধ্যমে দক্ষতা উন্নয়নে প্রশিক্ষণ প্রদান করছি।"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-brand-600 focus:outline-none"
              />
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
                ভেরিফিকেশনের জন্য আবেদন জমা দিন
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
