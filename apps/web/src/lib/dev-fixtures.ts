import type {
  CategorySummary,
  CommissionRule,
  CourseCardItem,
  VerificationStatus,
} from '@bd-course/shared';

/**
 * ডেভেলপমেন্ট স্যাম্পল ফিক্সচার ([ডেভ স্যাম্পল] হিসেবে স্পষ্টভাবে চিহ্নিত)
 */

export interface InstructorApplicationRecord {
  id: string;
  slug: string;
  fullNameBn: string;
  email: string;
  phone: string;
  headlineBn: string;
  bioBn: string;
  organizationNameBn?: string;
  expertiseTags: string[];
  payoutMethodLabelBn: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  appliedAt: string;
}

export interface StudentEnrollmentRecord {
  id: string;
  courseId: string;
  courseSlug: string;
  studentNameBn: string;
  paidPoisha: number;
  platformCommissionPoisha: number;
  instructorNetPoisha: number;
  progressPercent: number;
  completedLessonIds: string[];
  enrolledAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorRoleBn: string;
  actionBn: string;
  entityType: string;
  entityTitleBn: string;
  createdAt: string;
}

export const DEV_SAMPLE_CATEGORIES: CategorySummary[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    slug: 'academic-hsc-ssc',
    nameEn: 'Academic (SSC & HSC)',
    nameBn: 'একাডেমিক শিক্ষা (এসএসসি ও এইচএসসি)',
    descriptionEn: 'Board curriculum physics, higher math, chemistry & ICT',
    descriptionBn: 'বোর্ড সিলেবাস অনুযায়ী পদার্থবিজ্ঞান, উচ্চতর গণিত, রসায়ন ও আইসিটি',
    iconName: 'GraduationCap',
    courseCount: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    slug: 'admission-bcs-job',
    nameEn: 'Admission & Job Prep',
    nameBn: 'ভর্তি পরীক্ষা ও চাকরি প্রস্তুতি',
    descriptionEn: 'Engineering, Medical, Varsity Admission & BCS preparation',
    descriptionBn: 'ইঞ্জিনিয়ারিং, মেডিকেল, ভার্সিটি ভর্তি ও বিসিএস প্রস্তুতি',
    iconName: 'Award',
    courseCount: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    slug: 'programming-web-dev',
    nameEn: 'Programming & Web Dev',
    nameBn: 'প্রোগ্রামিং ও ওয়েব ডেভেলপমেন্ট',
    descriptionEn: 'Full-stack TypeScript, Next.js, Python & backend architecture',
    descriptionBn: 'ফুল-স্ট্যাক টাইপস্ক্রিপ্ট, নেক্সট.জেএস, পাইথন ও ব্যাকএন্ড আর্কিটেকচার',
    iconName: 'Code2',
    courseCount: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    slug: 'freelancing-design',
    nameEn: 'Freelancing & Design',
    nameBn: 'ফ্রিল্যান্সিং ও ক্রিয়েটিভ ডিজাইন',
    descriptionEn: 'UI/UX design, brand identity, and video editing',
    descriptionBn: 'গ্রাফিক ডিজাইন, ইউআই/ইউএক্স এবং ভিডিও এডিটিং স্কিল',
    iconName: 'Palette',
    courseCount: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    slug: 'languages-ielts-arabic',
    nameEn: 'English, IELTS & Arabic',
    nameBn: 'ইংরেজি, আইইএলটিএস ও আরবি ভাষা',
    descriptionEn: 'IELTS Academic/GT, spoken fluency & Quranic Arabic',
    descriptionBn: 'আইইএলটিএস, স্পোকেন ইংলিশ ও কুরআনিক আরবি শিক্ষা',
    iconName: 'Languages',
    courseCount: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    slug: 'ai-digital-marketing',
    nameEn: 'AI Tools & Digital Marketing',
    nameBn: 'এআই টুলস ও ডিজিটাল মার্কেটিং',
    descriptionEn: 'Practical AI workflows, SEO & performance analytics',
    descriptionBn: 'প্র্যাকটিক্যাল এআই ওয়ার্কফ্লো, এসইও ও ডিজিটাল মার্কেটিং',
    iconName: 'Sparkles',
    courseCount: 0,
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    slug: 'business-finance',
    nameEn: 'Business & Finance',
    nameBn: 'ব্যবসা, উদ্যোক্তা ও ফাইন্যান্স',
    descriptionEn: 'SME operations, accounting & e-commerce management in BD',
    descriptionBn: 'এসএমই পরিচালনা, একাউন্টিং ও ই-কমার্স ম্যানেজমেন্ট',
    iconName: 'TrendingUp',
    courseCount: 0,
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    slug: 'islamic-education',
    nameEn: 'Islamic Studies',
    nameBn: 'ইসলামিক শিক্ষা ও আদব',
    descriptionEn: 'Tajweed rules, daily Fiqh & Seerah studies',
    descriptionBn: 'তাজবীদ, দৈনন্দিন ফিকহ ও সীরাত শিক্ষা',
    iconName: 'BookOpen',
    courseCount: 0,
  },
];

export const DEV_SAMPLE_COMMISSION_RULES: CommissionRule[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: '[ডেভ স্যাম্পল] ডিফল্ট প্ল্যাটফর্ম কমিশন (১০%)',
    scope: 'platform_default',
    commissionBps: 1000,
    minAllowedBps: 500,
    maxAllowedBps: 2000,
    settlementHoldDays: 7,
    priority: 100,
    isActive: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: '[ডেভ স্যাম্পল] প্রশিক্ষকের নিজস্ব কুপন রেফারেল কমিশন (৫%)',
    scope: 'instructor_promo_attribution',
    commissionBps: 500,
    minAllowedBps: 500,
    maxAllowedBps: 2000,
    settlementHoldDays: 7,
    priority: 10,
    isActive: true,
  },
];

export const DEV_SAMPLE_INSTRUCTOR_APPLICATIONS: InstructorApplicationRecord[] = [
  {
    id: 'inst-sample-01',
    slug: 'sample-instructor-physics',
    fullNameBn: '[ডেভ স্যাম্পল] তানভীর আহমেদ (নমুনা প্রশিক্ষক)',
    email: 'tanvir.demo@example.com',
    phone: '+8801700000001',
    headlineBn: 'পদার্থবিজ্ঞান ও উচ্চতর গণিত প্রশিক্ষক (১০+ বছরের অভিজ্ঞতা — নমুনা ডেটা)',
    bioBn: 'বাংলাদেশের শিক্ষার্থীদের জন্য বোর্ড ও ইঞ্জিনিয়ারিং ভর্তি পরীক্ষার পদার্থবিজ্ঞান সহজবোধ্যভাবে উপস্থাপনের জন্য পরিচিত নমুনা প্রশিক্ষক প্রোফাইল।',
    organizationNameBn: 'স্যাম্পল সায়েন্স একাডেমি',
    expertiseTags: ['HSC Physics', 'Engineering Admission', 'Vector Mechanics'],
    payoutMethodLabelBn: 'ব্যাংক ট্রান্সফার (ডাচ-বাংলা ব্যাংক — ****৪৫২১)',
    verificationStatus: 'approved',
    appliedAt: '২০২৬-১০-১৫',
  },
  {
    id: 'inst-sample-02',
    slug: 'sample-instructor-dev',
    fullNameBn: '[ডেভ স্যাম্পল] ফারহানা রহমান (নমুনা প্রশিক্ষক)',
    email: 'farhana.demo@example.com',
    phone: '+8801700000002',
    headlineBn: 'ফুল-স্ট্যাক সফটওয়্যার আর্কিটেক্ট ও মেন্টর (নমুনা ডেটা)',
    bioBn: 'টাইপস্ক্রিপ্ট, নেক্সট.জেএস এবং পোস্টগ্রেএসকিউএল নিয়ে প্রোডাকশন গ্রেড অ্যাপ্লিকেশন তৈরির হাতে-কলমে প্রশিক্ষক (ডেভেলপমেন্ট ফিক্সচার)।',
    expertiseTags: ['Next.js', 'TypeScript', 'PostgreSQL', 'System Design'],
    payoutMethodLabelBn: 'বিকাশ মার্চেন্ট ডিসবার্সমেন্ট (****৮৮৯০)',
    verificationStatus: 'approved',
    appliedAt: '২০২৬-১০-১৬',
  },
  {
    id: 'inst-sample-03',
    slug: 'sample-instructor-ielts',
    fullNameBn: '[ডেভ স্যাম্পল] মাহমুদুল হাসান (নমুনা প্রশিক্ষক)',
    email: 'mahmud.demo@example.com',
    phone: '+8801700000003',
    headlineBn: 'আইইএলটিএস ও একাডেমিক ইংলিশ ট্রেইনার (নমুনা ডেটা)',
    bioBn: 'আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং মডিউলের রাইটিং ও স্পিকিং প্রস্তুতির নমুনা প্রশিক্ষক প্রোফাইল।',
    organizationNameBn: 'স্যাম্পল ল্যাঙ্গুয়েজ সেন্টার',
    expertiseTags: ['IELTS Academic', 'Spoken English', 'Writing Task 2'],
    payoutMethodLabelBn: 'ব্যাংক ট্রান্সফার (সিটি ব্যাংক — ****১৯০২)',
    verificationStatus: 'approved',
    appliedAt: '২০২৬-১০-১৮',
  },
  {
    id: 'inst-sample-04',
    slug: 'sample-instructor-design',
    fullNameBn: '[ডেভ স্যাম্পল] রাশেদুল ইসলাম (আবেদনকৃত প্রশিক্ষক)',
    email: 'rashed.demo@example.com',
    phone: '+8801700000004',
    headlineBn: 'ইউআই/ইউএক্স ও প্রোডাক্ট ডিজাইনার (নমুনা আবেদন)',
    bioBn: 'ফিগমা, ডিজাইন সিস্টেম এবং ফ্রিল্যান্স মার্কেটপ্লেস গাইডলাইনের ওপর কোর্স প্রকাশের জন্য আবেদনকৃত নমুনা প্রশিক্ষক।',
    organizationNameBn: 'ক্রিয়েটিভ ডিজাইন স্টুডিও বিডি (নমুনা)',
    expertiseTags: ['Figma', 'UI/UX Design', 'Freelancing'],
    payoutMethodLabelBn: 'নগদ ডিসবার্সমেন্ট (****৩৩৪১)',
    verificationStatus: 'pending',
    appliedAt: '২০২৬-১০-২৩',
  },
];

export const DEV_SAMPLE_COURSES: CourseCardItem[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    slug: 'sample-hsc-physics-1st-paper',
    titleEn: '[DEV SAMPLE] HSC Physics 1st Paper Complete Concept & Math Solver',
    titleBn: '[ডেভ স্যাম্পল] এইচএসসি পদার্থবিজ্ঞান ১ম পত্র পূর্ণাঙ্গ কনসেপ্ট ও গাণিতিক সমাধান',
    subtitleEn: 'Vector, Newtonian Mechanics, Work-Power-Energy & Gravitation for Board & Admission',
    subtitleBn: 'ভেক্টর, নিউটনিয়ান বলবিদ্যা, কাজ-ক্ষমতা-শক্তি ও মহাকর্ষ অধ্যায়ের বোর্ড এবং ভর্তি প্রস্তুতি',
    categorySlug: 'academic-hsc-ssc',
    categoryNameEn: 'Academic (SSC & HSC)',
    categoryNameBn: 'একাডেমিক শিক্ষা (এসএসসি ও এইচএসসি)',
    language: 'bn',
    level: 'intermediate',
    deliveryMode: 'recorded',
    pricePoisha: 150000, // ১,৫০০ টাকা
    discountPricePoisha: 120000, // ১,২০০ টাকা
    status: 'published',
    instructor: {
      id: 'inst-sample-01',
      slug: 'sample-instructor-physics',
      fullName: '[DEV SAMPLE] Tanvir Ahmed',
      fullNameBn: '[ডেভ স্যাম্পল] তানভীর আহমেদ (নমুনা প্রশিক্ষক)',
      headline: 'পদার্থবিজ্ঞান ও উচ্চতর গণিত প্রশিক্ষক — ডেভেলপমেন্ট ডেটা',
      organizationName: 'স্যাম্পল সায়েন্স একাডেমি',
      verificationStatus: 'approved',
      totalStudentsCount: 0,
      averageRating: 0,
    },
    enrollmentCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    totalLessonsCount: 4,
    totalDurationSeconds: 32400,
    learningObjectives: [
      'বোর্ড সৃজনশীল (CQ) ও বহুনির্বাচনি (MCQ) প্রশ্নের ধাপে ধাপে সমাধান',
      'ভেক্টর ক্যালকুলাস ও নিউটনিয়ান বলবিদ্যার গাণিতিক সমস্যার সহজ কৌশল',
      'ইঞ্জিনিয়ারিং ও ভার্সিটি ভর্তি পরীক্ষার বিগত বছরের প্রশ্ন বিশ্লেষণ',
    ],
    prerequisites: [
      'এসএসসি পদার্থবিজ্ঞান ও সাধারণ গণিতের মৌলিক ধারণা',
      'ত্রিকোণমিতির সাধারণ সূত্রসমূহের ধারণা',
    ],
    sections: [
      {
        id: 'sec-phys-1',
        title: 'অধ্যায় ২: ভেক্টর পরিচিতি ও নদী-নৌকা সমস্যা',
        lessons: [
          {
            id: 'les-phys-1',
            title: 'ভেক্টর রাশির জ্যামিতিক ধারণা ও লব্ধি নির্ণয় (ফ্রি প্রিভিউ)',
            lessonType: 'video',
            durationSeconds: 1260,
            isFreePreview: true,
          },
          {
            id: 'les-phys-2',
            title: 'নদী-নৌকা এবং বৃষ্টি-ছাতা সংক্রান্ত গাণিতিক শর্টকাট ও পিডিএফ নোট',
            lessonType: 'pdf',
            durationSeconds: 900,
            isFreePreview: false,
          },
        ],
      },
      {
        id: 'sec-phys-2',
        title: 'অধ্যায় ৪: নিউটনিয়ান বলবিদ্যা ও সংঘর্ষ',
        lessons: [
          {
            id: 'les-phys-3',
            title: 'ভরবেগের সংরক্ষণ সূত্র ও রকেটের গতি',
            lessonType: 'video',
            durationSeconds: 1500,
            isFreePreview: false,
          },
          {
            id: 'les-phys-4',
            title: 'নিউটনিয়ান বলবিদ্যা মূল্যায়ন কুইজ (১০টি এমসিকিউ)',
            lessonType: 'quiz',
            durationSeconds: 600,
            isFreePreview: false,
          },
        ],
      },
    ],
    isSampleDevelopmentData: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    slug: 'sample-fullstack-nextjs-postgres',
    titleEn: '[DEV SAMPLE] Production Next.js, TypeScript & PostgreSQL Engineering',
    titleBn: '[ডেভ স্যাম্পল] প্রোডাকশন নেক্সট.জেএস, টাইপস্ক্রিপ্ট ও পোস্টগ্রেএসকিউএল ইঞ্জিনিয়ারিং',
    subtitleEn: 'Build secure web applications with Row-Level Security, Server Actions & BDT payment flows',
    subtitleBn: 'রো-লেভেল সিকিউরিটি, সার্ভার অ্যাকশন ও বাংলাদেশি পেমেন্ট ইন্টিগ্রেশনসহ ওয়েব অ্যাপ তৈরি',
    categorySlug: 'programming-web-dev',
    categoryNameEn: 'Programming & Web Dev',
    categoryNameBn: 'প্রোগ্রামিং ও ওয়েব ডেভেলপমেন্ট',
    language: 'bn',
    level: 'intermediate',
    deliveryMode: 'recorded',
    pricePoisha: 250000, // ২,৫০০ টাকা
    discountPricePoisha: 200000, // ২,০০০ টাকা
    status: 'published',
    instructor: {
      id: 'inst-sample-02',
      slug: 'sample-instructor-dev',
      fullName: '[DEV SAMPLE] Farhana Rahman',
      fullNameBn: '[ডেভ স্যাম্পল] ফারহানা রহমান (নমুনা প্রশিক্ষক)',
      headline: 'ফুল-স্ট্যাক সফটওয়্যার আর্কিটেক্ট — ডেভেলপমেন্ট ডেটা',
      verificationStatus: 'approved',
      totalStudentsCount: 0,
      averageRating: 0,
    },
    enrollmentCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    totalLessonsCount: 3,
    totalDurationSeconds: 46800,
    learningObjectives: [
      'নরমালাইজড পোস্টগ্রেএসকিউএল ডাটাবেস ও আরএলএস (RLS) পলিসি ডিজাইন',
      'ইন্টিজার পয়সা ভিত্তিক নিরাপদ পেমেন্ট ওয়েবহুক ও কমিশন লেজার তৈরি',
      'নেক্সট.জেএস অ্যাপ রাউটার ও টাইপস্ক্রিপ্ট দিয়ে স্কেলেবল প্রজেক্ট আর্কিটেকচার',
    ],
    prerequisites: ['জাভাস্ক্রিপ্ট, এইচটিএমএল ও সিএসএস-এর প্রাথমিক ধারণা'],
    sections: [
      {
        id: 'sec-dev-1',
        title: 'মডিউল ১: ডাটাবেস ডিজাইন ও রো-লেভেল সিকিউরিটি (RLS)',
        lessons: [
          {
            id: 'les-dev-1',
            title: 'মাল্টি-ভেন্ডর মার্কেটপ্লেস ডাটাবেস আর্কিটেকচার (ফ্রি প্রিভিউ)',
            lessonType: 'video',
            durationSeconds: 1400,
            isFreePreview: true,
          },
          {
            id: 'les-dev-2',
            title: 'পোস্টগ্রেএসকিউএল SECURITY DEFINER ফাংশন ও পলিসি ল্যাব',
            lessonType: 'video',
            durationSeconds: 1800,
            isFreePreview: false,
          },
        ],
      },
      {
        id: 'sec-dev-2',
        title: 'মডিউল ২: পেমেন্ট গেটওয়ে ও অডিট লেজার',
        lessons: [
          {
            id: 'les-dev-3',
            title: 'আইডেমপোটেন্ট ওয়েবহুক ভেরিফিকেশন ও রিফান্ড হিসাব (পিডিএফ গাইড)',
            lessonType: 'pdf',
            durationSeconds: 1200,
            isFreePreview: false,
          },
        ],
      },
    ],
    isSampleDevelopmentData: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    slug: 'sample-ielts-academic-masterplan',
    titleEn: '[DEV SAMPLE] IELTS Academic Band 7.5+ Structured Preparation',
    titleBn: '[ডেভ স্যাম্পল] আইইএলটিএস একাডেমিক ব্যান্ড ৭.৫+ পূর্ণাঙ্গ প্রস্তুতি কোর্স',
    subtitleEn: 'Reading, Listening, Writing Task 1 & 2 rubrics, and Speaking mock modules',
    subtitleBn: 'রিডিং, লিসেনিং, রাইটিং টাস্ক ১ ও ২ এবং স্পিকিং মক প্র্যাকটিস মডিউল',
    categorySlug: 'languages-ielts-arabic',
    categoryNameEn: 'English, IELTS & Arabic',
    categoryNameBn: 'ইংরেজি, আইইএলটিএস ও আরবি ভাষা',
    language: 'mixed',
    level: 'all_levels',
    deliveryMode: 'hybrid',
    pricePoisha: 180000, // ১,৮০০ টাকা
    discountPricePoisha: null,
    status: 'published',
    instructor: {
      id: 'inst-sample-03',
      slug: 'sample-instructor-ielts',
      fullName: '[DEV SAMPLE] Mahmudul Hasan',
      fullNameBn: '[ডেভ স্যাম্পল] মাহমুদুল হাসান (নমুনা প্রশিক্ষক)',
      headline: 'নমুনা ভাষা প্রশিক্ষক — ডেভেলপমেন্ট ডেটা',
      organizationName: 'স্যাম্পল ল্যাঙ্গুয়েজ সেন্টার',
      verificationStatus: 'approved',
      totalStudentsCount: 0,
      averageRating: 0,
    },
    enrollmentCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    totalLessonsCount: 2,
    totalDurationSeconds: 28800,
    learningObjectives: [
      '৪০ মিনিট সময়ের মধ্যে রাইটিং টাস্ক ২ কাঠামোগতভাবে সম্পন্ন করা',
      'রিডিং প্যাসেজে True/False/Not Given দ্রুত সমাধানের কৌশল',
    ],
    prerequisites: ['ইংরেজি রিডিং ও গ্রামারের প্রাথমিক ধারণা'],
    sections: [
      {
        id: 'sec-ielts-1',
        title: 'মডিউল ১: একাডেমিক রাইটিং টাস্ক ১ ও ২',
        lessons: [
          {
            id: 'les-ielts-1',
            title: 'ব্যান্ড ৭.৫+ মার্কিং ক্রাইটেরিয়া বিশ্লেষণ (ফ্রি প্রিভিউ)',
            lessonType: 'video',
            durationSeconds: 1100,
            isFreePreview: true,
          },
          {
            id: 'les-ielts-2',
            title: 'এসে রাইটিং টেমপ্লেট ও ভোকাবুলারি শিট',
            lessonType: 'pdf',
            durationSeconds: 900,
            isFreePreview: false,
          },
        ],
      },
    ],
    isSampleDevelopmentData: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    slug: 'sample-ui-ux-figma-bootcamp',
    titleEn: '[DEV SAMPLE] Complete UI/UX Design with Figma & Design Systems',
    titleBn: '[ডেভ স্যাম্পল] ফিগমা ও আধুনিক ইউআই/ইউএক্স ডিজাইন সিস্টেম বুটক্যাম্প',
    subtitleEn: 'Wireframing, Auto-Layout, Component Variants & Developer Handoff',
    subtitleBn: 'ওয়্যারফ্রেমিং, অটো-লেআউট, কম্পোনেন্ট ভ্যারিয়েন্ট এবং ক্লায়েন্ট প্রজেক্ট হ্যান্ডঅফ',
    categorySlug: 'freelancing-design',
    categoryNameEn: 'Freelancing & Design',
    categoryNameBn: 'ফ্রিল্যান্সিং ও ক্রিয়েটিভ ডিজাইন',
    language: 'bn',
    level: 'beginner',
    deliveryMode: 'recorded',
    pricePoisha: 160000, // ১,৬০০ টাকা
    discountPricePoisha: 135000, // ১,৩৫০ টাকা
    status: 'submitted', // অ্যাডমিন অনুমোদনের অপেক্ষায়
    instructor: {
      id: 'inst-sample-01',
      slug: 'sample-instructor-physics',
      fullName: '[DEV SAMPLE] Tanvir Ahmed',
      fullNameBn: '[ডেভ স্যাম্পল] তানভীর আহমেদ (নমুনা প্রশিক্ষক)',
      headline: 'নমুনা প্রশিক্ষক — ডেভেলপমেন্ট ডেটা',
      organizationName: 'স্যাম্পল সায়েন্স একাডেমি',
      verificationStatus: 'approved',
      totalStudentsCount: 0,
      averageRating: 0,
    },
    enrollmentCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    totalLessonsCount: 2,
    totalDurationSeconds: 18000,
    learningObjectives: [
      'ফিগমা অটো-লেআউট ও রেসপনসিভ গ্রিড সিস্টেম তৈরি',
      'মোবাইল ও ওয়েব অ্যাপের জন্য পূর্ণাঙ্গ ডিজাইন সিস্টেম তৈরি',
    ],
    prerequisites: ['কম্পিউটার চালনার সাধারণ দক্ষতা'],
    sections: [
      {
        id: 'sec-ui-1',
        title: 'মডিউল ১: ফিগমা ফান্ডামেন্টালস ও অটো-লেআউট',
        lessons: [
          {
            id: 'les-ui-1',
            title: 'ডিজাইন টোকেন, টাইপোগ্রাফি ও কালার হায়ারার্কি (ফ্রি প্রিভিউ)',
            lessonType: 'video',
            durationSeconds: 1080,
            isFreePreview: true,
          },
          {
            id: 'les-ui-2',
            title: 'রেসপনসিভ কার্ড ও নেভিগেশন বার ডিজাইন অ্যাসাইনমেন্ট',
            lessonType: 'assignment',
            durationSeconds: 1200,
            isFreePreview: false,
          },
        ],
      },
    ],
    isSampleDevelopmentData: true,
  },
];
