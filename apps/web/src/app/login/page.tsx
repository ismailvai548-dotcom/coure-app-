import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Badge, Card } from '@/components/ui/primitives';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Card className="p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="brand">ওয়েব + অ্যান্ড্রয়েড সমন্বিত অ্যাকাউন্ট</Badge>
            <ShieldCheck className="h-5 w-5 text-brand-600" />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            লগইন ও রেজিস্ট্রেশন
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            একই শিক্ষার্থী, প্রশিক্ষক অথবা প্রতিষ্ঠান অ্যাকাউন্ট দিয়ে ওয়েবসাইট এবং অ্যান্ড্রয়েড অ্যাপে প্রবেশ করুন।
          </p>

          {!supabaseReady && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <strong>লাইভ লগইনের জন্য সুপাবেস কনফিগারেশন প্রয়োজন:</strong>{' '}
              <code>.env.example</code> ফাইলটি <code>apps/web/.env.local</code> নামে কপি করে আপনার প্রজেক্টের কী (Key) বসিয়ে নিন।
            </div>
          )}

          <form className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                ইমেইল অথবা মোবাইল নম্বর (+৮৮০)
              </label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={!supabaseReady}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {supabaseReady
                ? 'অ্যাকাউন্টে প্রবেশ করুন'
                : 'লাইভ লগইন চালু করতে সুপাবেস ENV যুক্ত করুন'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল (ডাটাবেস RLS দ্বারা সুরক্ষিত):
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>শিক্ষার্থী: কোর্স লাইব্রেরি, প্রগ্রেস ট্র্যাকিং, বুকমার্ক ও রিভিউ</li>
              <li>প্রশিক্ষক: কোর্স তৈরি, বিক্রয় হিসাব ও পেআউট উত্তোলন অনুরোধ</li>
              <li>প্রতিষ্ঠান/এজেন্সি: একাধিক প্রশিক্ষক ও কোর্স পরিচালনা</li>
              <li>অ্যাডমিন: কোর্স অনুমোদন, কমিশন হার নির্ধারণ ও অডিট লেজার</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              ← মার্কেটপ্লেস হোমপেজে ফিরে যান
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
