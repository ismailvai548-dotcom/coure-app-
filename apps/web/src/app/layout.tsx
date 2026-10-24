import type { Metadata } from 'next';
import { Hind_Siliguri, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'শিক্ষাসেতু বিডি | বাংলাদেশের অল-ইন-ওয়ান কোর্স মার্কেটপ্লেস',
  description:
    'বাংলাদেশের যাচাইকৃত শিক্ষক, প্রশিক্ষক, কোচিং সেন্টার এবং শিক্ষা প্রতিষ্ঠানের কোর্স খুঁজুন, তুলনা করুন এবং শিখুন।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
