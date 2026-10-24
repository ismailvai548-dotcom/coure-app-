import React from 'react';
import { notFound } from 'next/navigation';
import { toBengaliDigits } from '@bd-course/shared';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card, CourseCard } from '@/components/ui/primitives';
import { readMarketplaceState } from '@/lib/store/marketplace-store';
import { Building2, ShieldCheck } from 'lucide-react';

export default async function InstructorPublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = await readMarketplaceState();

  const instructorApp = state.instructorApplications.find(
    (i) => i.slug === slug
  );
  const instructorCourses = state.courses.filter(
    (c) => c.instructor.slug === slug && c.status === 'published'
  );

  if (!instructorApp && instructorCourses.length === 0) {
    notFound();
  }

  const displayName =
    instructorApp?.fullNameBn ??
    instructorCourses[0]?.instructor.fullNameBn ??
    'নমুনা প্রশিক্ষক';
  const headline =
    instructorApp?.headlineBn ??
    instructorCourses[0]?.instructor.headline ??
    'যাচাইকৃত প্রশিক্ষক';
  const bio =
    instructorApp?.bioBn ??
    'বাংলাদেশের শিক্ষার্থীদের জন্য মানসম্মত ও ব্যবহারিক কোর্স পরিচালনাকারী প্রশিক্ষক প্রোফাইল।';
  const orgName =
    instructorApp?.organizationNameBn ??
    instructorCourses[0]?.instructor.organizationName;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              <ShieldCheck className="h-3.5 w-3.5" /> যাচাইকৃত প্রশিক্ষক স্টোরফ্রন্ট
            </Badge>
            <Badge variant="warning">ডেভ স্যাম্পল প্রোফাইল</Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {displayName}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-700">{headline}</p>

          {orgName && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-600">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>প্রতিষ্ঠান: {orgName}</span>
            </div>
          )}

          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-600">
            {bio}
          </p>

          {instructorApp?.expertiseTags &&
            instructorApp.expertiseTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {instructorApp.expertiseTags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
        </Card>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            এই প্রশিক্ষকের প্রকাশিত কোর্সসমূহ (
            {toBengaliDigits(instructorCourses.length)}টি)
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {instructorCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
