import React from 'react';
import Link from 'next/link';
import { DICTIONARY, toBengaliDigits } from '@bd-course/shared';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card, CourseCard } from '@/components/ui/primitives';
import { DEV_SAMPLE_CATEGORIES } from '@/lib/dev-fixtures';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Lock,
  Search,
  Smartphone,
  Store,
} from 'lucide-react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const t = DICTIONARY.bn;
  const state = await readMarketplaceState();

  const publishedCourses = state.courses.filter(
    (c) => c.status === 'published'
  );

  const selectedCategory = resolvedParams.category;
  const searchQuery = (resolvedParams.q ?? '').trim().toLowerCase();

  const filteredCourses = publishedCourses.filter((c) => {
    const matchesCategory =
      !selectedCategory || c.categorySlug === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      c.titleBn.toLowerCase().includes(searchQuery) ||
      c.titleEn.toLowerCase().includes(searchQuery) ||
      (c.instructor.fullNameBn ?? '').toLowerCase().includes(searchQuery) ||
      c.instructor.fullName.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* হিরো সেকশন */}
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="brand">{t.hero.badge}</Badge>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
                {t.hero.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                {t.hero.subtitle}
              </p>

              {/* সার্চ বার */}
              <form
                action="/courses"
                method="GET"
                className="mt-6 flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={resolvedParams.q ?? ''}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {t.hero.searchAction}
                </button>
              </form>

              {/* প্ল্যাটফর্মের মূল বৈশিষ্ট্য */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700">
                  <Store className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{t.metrics.multiVendor}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{t.metrics.commissionModel}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700">
                  <Smartphone className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{t.metrics.sharedAccount}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* কোর্স ক্যাটাগরিসমূহ */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                সমর্থিত কোর্স ক্যাটাগরিসমূহ
              </h2>
              <p className="text-xs text-slate-500">
                একাডেমিক শিক্ষা, ভর্তি প্রস্তুতি, ফ্রিল্যান্সিং, প্রোগ্রামিং, ভাষা শিক্ষা, ব্যবসা ও ইসলামিক স্টাডিজ
              </p>
            </div>
            {selectedCategory ? (
              <Link
                href="/"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                ফিল্টার মুছে সকল ক্যাটাগরি দেখুন
              </Link>
            ) : (
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
              >
                অ্যাডভান্সড ফিল্টারসহ সকল কোর্স <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DEV_SAMPLE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = publishedCourses.filter(
                (c) => c.categorySlug === cat.slug
              ).length;
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50'
                      : 'border-slate-200 bg-white hover:border-brand-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {cat.nameBn}
                    </span>
                    <Layers className="h-4 w-4 text-brand-600" />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {cat.descriptionBn}
                  </p>
                  <span className="mt-2.5 inline-block text-[11px] font-semibold text-brand-700">
                    {toBengaliDigits(count)}টি প্রকাশিত কোর্স
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* প্রকাশিত কোর্স তালিকা */}
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                প্রকাশিত কোর্সসমূহ ({toBengaliDigits(filteredCourses.length)}টি)
              </h2>
              <p className="text-xs text-slate-500">
                যেকোনো কোর্সে ক্লিক করে বিস্তারিত সিলেবাস দেখুন এবং ভর্তি প্রক্রিয়া টেস্ট করুন
              </p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              + প্রশিক্ষক হিসেবে নতুন কোর্স যোগ করুন
            </Link>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                এই ফিল্টারে কোনো প্রকাশিত কোর্স পাওয়া যায়নি।
              </p>
              <Link
                href="/"
                className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                সকল কোর্স দেখুন
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-brand-600" />
            <span>
              ডাটাবেস রো-লেভেল সিকিউরিটি (RLS) • পূর্ণসংখ্যা পয়সা লেজার • ওয়েব ও অ্যান্ড্রয়েড সমন্বিত ব্যাকএন্ড
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/courses" className="hover:text-slate-900">
              সকল কোর্স
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900">
              স্টুডেন্ট ড্যাশবোর্ড
            </Link>
            <Link href="/instructor" className="hover:text-slate-900">
              প্রশিক্ষক প্যানেল
            </Link>
            <Link href="/admin" className="hover:text-slate-900">
              অ্যাডমিন প্যানেল
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
