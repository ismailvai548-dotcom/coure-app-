/**
 * সম্পূর্ণ বাংলা ইন্টারফেস ডিকশনারি (ভবিষ্যতে অন্য ভাষা যুক্ত করার সুবিধাসহ)
 */

export type SupportedLocale = 'bn' | 'en';

export const DICTIONARY: Record<
  SupportedLocale,
  {
    brandName: string;
    brandTagline: string;
    devSampleBanner: string;
    nav: {
      explore: string;
      categories: string;
      studentDashboard: string;
      instructorPortal: string;
      adminConsole: string;
      signIn: string;
      becomeInstructor: string;
    };
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      searchAction: string;
    };
    metrics: {
      commissionModel: string;
      multiVendor: string;
      sharedAccount: string;
    };
  }
> = {
  bn: {
    brandName: 'শিক্ষাসেতু বিডি',
    brandTagline: 'বাংলাদেশের অল-ইন-ওয়ান কোর্স মার্কেটপ্লেস',
    devSampleBanner:
      '[ডেভেলপমেন্ট স্যাম্পল মোড] নিচের সকল কোর্স, প্রশিক্ষক ও লেনদেন শুধুমাত্র লোকাল ডেভেলপমেন্ট ও টেস্টিংয়ের জন্য প্রদর্শিত নমুনা ডেটা।',
    nav: {
      explore: 'সকল কোর্স',
      categories: 'ক্যাটাগরি',
      studentDashboard: 'আমার কোর্সসমূহ',
      instructorPortal: 'প্রশিক্ষক প্যানেল',
      adminConsole: 'অ্যাডমিন প্যানেল',
      signIn: 'লগইন / রেজিস্ট্রেশন',
      becomeInstructor: 'প্রশিক্ষক হোন',
    },
    hero: {
      badge: 'বাংলাদেশের শিক্ষক, কোচিং সেন্টার ও ট্রেনিং ইনস্টিটিউটের উন্মুক্ত প্ল্যাটফর্ম',
      title: 'যেকোনো দক্ষতা ও একাডেমিক বিষয় শিখুন দেশের সেরা যাচাইকৃত প্রশিক্ষকদের কাছ থেকে',
      subtitle:
        'ওয়েবসাইট ও অ্যান্ড্রয়েড অ্যাপে একই অ্যাকাউন্টে শিখুন। বাংলাদেশি টাকায় (৳) নিরাপদ পেমেন্ট, রেকর্ডেড ভিডিও, পিডিএফ নোট এবং কুইজসহ পূর্ণাঙ্গ লার্নিং অভিজ্ঞতা।',
      searchPlaceholder: 'কোর্স, বিষয় বা প্রশিক্ষকের নাম লিখুন (যেমন: এইচএসসি পদার্থবিজ্ঞান, ওয়েব ডেভেলপমেন্ট, আইইএলটিএস)...',
      searchAction: 'কোর্স খুঁজুন',
    },
    metrics: {
      commissionModel: 'কনফিগারযোগ্য ৫%–২০% মার্কেটপ্লেস কমিশন (ডিফল্ট ১০%)',
      multiVendor: 'স্বাধীন শিক্ষক ও প্রতিষ্ঠানের নিজস্ব কোর্স স্টোরফ্রন্ট',
      sharedAccount: 'ওয়েবসাইট ও অ্যান্ড্রয়েড অ্যাপে তাৎক্ষণিক কোর্স সিঙ্ক',
    },
  },
  en: {
    brandName: 'ShikkhaSetu BD',
    brandTagline: "Bangladesh's All-in-One Multi-Vendor Course Marketplace",
    devSampleBanner:
      '[DEVELOPMENT SAMPLE DATA] All courses, instructors, and financial figures shown below are clearly marked development fixtures, not live commercial records.',
    nav: {
      explore: 'Explore Courses',
      categories: 'Categories',
      studentDashboard: 'Student Library',
      instructorPortal: 'Instructor Studio',
      adminConsole: 'Admin Console',
      signIn: 'Sign In / Register',
      becomeInstructor: 'Teach on Platform',
    },
    hero: {
      badge: 'Multi-Vendor Marketplace for Independent Teachers, Coaching Centers & Agencies',
      title: 'Master Academic, Admission & Career Skills with Verified Bangladeshi Instructors',
      subtitle:
        'Buy once in BDT (৳) and learn seamlessly across our Website and Android App with protected video streaming, quizzes, and verified certificates.',
      searchPlaceholder: 'Search courses, skills, or instructors (e.g., HSC Physics, Next.js, IELTS)...',
      searchAction: 'Search',
    },
    metrics: {
      commissionModel: 'Configurable 5%–20% Commission Engine (10% Default)',
      multiVendor: 'Independent Instructor & Agency Storefronts',
      sharedAccount: 'Unified Web + Android Student Library',
    },
  },
};
