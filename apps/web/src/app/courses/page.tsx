import React from 'react';
import Link from 'next/link';
import { toBengaliDigits } from '@bd-course/shared';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card, CourseCard } from '@/components/ui/primitives';
import { DEV_SAMPLE_CATEGORIES } from '@/lib/dev-fixtures';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import { Filter, Search } from 'lucide-react';

export default async function CourseDiscoveryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
    mode?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const state = await readMarketplaceState();
  const published = state.courses.filter((c) => c.status === 'published');

  const query = (params.q ?? '').trim().toLowerCase();
  const category = params.category ?? '';
  const level = params.level ?? '';
  const mode = params.mode ?? '';
  const sort = params.sort ?? 'popular';

  const filtered = published
    .filter((c) => {
      if (category && c.categorySlug !== category) return false;
      if (level && c.level !== level) return false;
      if (mode && c.deliveryMode !== mode) return false;
      if (
        query &&
        !c.titleBn.toLowerCase().includes(query) &&
        !c.subtitleBn.toLowerCase().includes(query) &&
        !(c.instructor.fullNameBn ?? '').toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.discountPricePoisha ?? a.pricePoisha;
      const priceB = b.discountPricePoisha ?? b.pricePoisha;
      if (sort === 'price_asc') return priceA - priceB;
      if (sort === 'price_desc') return priceB - priceA;
      return b.enrollmentCount - a.enrollmentCount;
    });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Badge variant="brand">কোর্স ডিসকভারি ও অ্যাডভান্সড ফিল্টার</Badge>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            আপনার পছন্দের কোর্স খুঁজুন ({toBengaliDigits(filtered.length)}টি কোর্স পাওয়া গেছে)
          </h1>
          <p className="text-xs text-slate-600">
            বিষয়, কোর্সের ধরন, শিক্ষার স্তর এবং মূল্যের ভিত্তিতে কোর্স যাচাই ও তুলনা করুন।
          </p>
        </div>

        {/* ফিল্টার ফর্ম */}
        <Card className="mb-8 p-5">
          <form
            action="/courses"
            method="GET"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={params.q ?? ''}
                placeholder="কোর্স বা প্রশিক্ষকের নাম..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-brand-600 focus:outline-none"
              />
            </div>

            <select
              name="category"
              defaultValue={category}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-brand-600 focus:outline-none"
            >
              <option value="">সকল ক্যাটাগরি</option>
              {DEV_SAMPLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.nameBn}
                </option>
              ))}
            </select>

            <select
              name="mode"
              defaultValue={mode}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-brand-600 focus:outline-none"
            >
              <option value="">সকল ধরন (রেকর্ডেড / হাইব্রিড)</option>
              <option value="recorded">রেকর্ডেড কোর্স</option>
              <option value="hybrid">হাইব্রিড কোর্স</option>
              <option value="live_cohort">লাইভ ব্যাচ</option>
            </select>

            <div className="flex gap-2">
              <select
                name="sort"
                defaultValue={sort}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-brand-600 focus:outline-none"
              >
                <option value="popular">জনপ্রিয় কোর্স</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
              >
                <Filter className="h-3.5 w-3.5" />
                ফিল্টার
              </button>
            </div>
          </form>
        </Card>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-800">
              নির্বাচিত ফিল্টারে কোনো কোর্স পাওয়া যায়নি।
            </p>
            <Link
              href="/courses"
              className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:underline"
            >
              সকল ফিল্টার রিসেট করুন
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
