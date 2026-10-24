import React from 'react';
import Link from 'next/link';
import { DICTIONARY } from '@bd-course/shared';
import {
  BookMarked,
  ShieldAlert,
  LayoutDashboard,
  GraduationCap,
  Library,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export function Navbar() {
  const t = DICTIONARY.bn;
  const supabaseReady = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* ডেভেলপমেন্ট স্যাম্পল নোটিশ ব্যানার */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-900">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-700 shrink-0" />
          {t.devSampleBanner}
          {!supabaseReady && ' (লোকাল ডেভেলপমেন্ট স্টোর সক্রিয় — সকল পরিবর্তন লোকালি সংরক্ষিত হচ্ছে)'}
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-slate-900">
                {t.brandName}
              </span>
              <span className="block text-[11px] text-slate-500">
                {t.brandTagline}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
            <Link href="/courses" className="hover:text-brand-600">
              {t.nav.explore}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 hover:text-brand-600"
            >
              <Library className="h-3.5 w-3.5 text-brand-600" />
              {t.nav.studentDashboard}
            </Link>
            <Link href="/instructor" className="hover:text-brand-600">
              {t.nav.instructorPortal}
            </Link>
            <Link href="/admin" className="hover:text-brand-600">
              {t.nav.adminConsole}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Library className="h-3.5 w-3.5 text-brand-600" />
            আমার কোর্স
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            <BookMarked className="h-3.5 w-3.5 text-brand-600" />
            {t.nav.signIn}
          </Link>
          <Link
            href="/instructor/courses/new"
            className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-700 sm:inline-flex"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            নতুন কোর্স তৈরি করুন
          </Link>
        </div>
      </div>
    </header>
  );
}
