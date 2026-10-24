-- =============================================================================
-- Development Seed Data (CLEARLY MARKED AS [DEV SAMPLE] — NOT PRODUCTION DATA)
-- =============================================================================

INSERT INTO categories (id, slug, name_en, name_bn, description_en, description_bn, icon_name, display_order)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'academic-hsc-ssc', 'Academic (SSC & HSC)', 'একাডেমিক শিক্ষা (এসএসসি ও এইচএসসি)', 'Board curriculum physics, math, chemistry & ICT', 'বোর্ড সিলেবাস অনুযায়ী পদার্থবিজ্ঞান, গণিত, রসায়ন ও আইসিটি', 'GraduationCap', 1),
  ('11111111-1111-1111-1111-111111111102', 'admission-bcs-job', 'Admission & Job Prep', 'ভর্তি পরীক্ষা ও চাকরি প্রস্তুতি', 'BUET, Medical, University Admission & BCS preparation', 'বুয়েট, মেডিকেল, বিশ্ববিদ্যালয় ভর্তি এবং বিসিএস প্রস্তুতি', 'Award', 2),
  ('11111111-1111-1111-1111-111111111103', 'programming-web-dev', 'Programming & Web Dev', 'প্রোগ্রামিং ও ওয়েব ডেভেলপমেন্ট', 'Full-stack software engineering, Python, React & Next.js', 'ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ারিং, পাইথন, রিয়্যাক্ট ও নেক্সট.জেএস', 'Code2', 3),
  ('11111111-1111-1111-1111-111111111104', 'freelancing-design', 'Freelancing & Creative Design', 'ফ্রিল্যান্সিং ও ক্রিয়েটিভ ডিজাইন', 'Graphic design, UI/UX, and video editing skills', 'গ্রাফিক ডিজাইন, ইউআই/ইউএক্স এবং ভিডিও এডিটিং স্কিল', 'Palette', 4),
  ('11111111-1111-1111-1111-111111111105', 'languages-ielts-arabic', 'English, IELTS & Arabic', 'ইংরেজি, আইইএলটিএস ও আরবি ভাষা', 'Spoken English, IELTS Academic/GT, and Quranic Arabic', 'স্পোকেন ইংলিশ, আইইএলটিএস এবং কুরআনিক আরবি শিক্ষা', 'Languages', 5),
  ('11111111-1111-1111-1111-111111111106', 'ai-digital-marketing', 'AI Tools & Digital Marketing', 'এআই টুলস ও ডিজিটাল মার্কেটিং', 'Applied AI workflows, SEO, and meta performance marketing', 'এআই ওয়ার্কফ্লো, এসইও এবং মেটা মার্কেটিং', 'Sparkles', 6),
  ('11111111-1111-1111-1111-111111111107', 'business-finance', 'Business & Finance', 'ব্যবসা, উদ্যোক্তা ও ফাইন্যান্স', 'SME accounting, startup operations, and financial literacy', 'এসএমই একাউন্টিং, স্টার্টআপ অপারেশন ও ফিন্যান্সিয়াল লিটারেসি', 'TrendingUp', 7),
  ('11111111-1111-1111-1111-111111111108', 'islamic-education', 'Islamic Studies & Ethics', 'ইসলামিক শিক্ষা ও আদব', 'Tajweed, Fiqh fundamentals, and Islamic history', 'তাজবীদ, ফিকহ ও ইসলামিক ইতিহাস', 'BookOpen', 8)
ON CONFLICT (slug) DO NOTHING;

-- Default Configurable Platform Commission Rule (10.00% = 1000 bps, allowed range 5%–20%)
INSERT INTO commission_rules (
  id, name, scope, commission_bps, min_allowed_bps, max_allowed_bps, settlement_hold_days, priority, is_active
) VALUES (
  '22222222-2222-2222-2222-222222222201',
  'Default Platform Marketplace Commission (10%)',
  'platform_default',
  1000,
  500,
  2000,
  7,
  100,
  TRUE
) ON CONFLICT (id) DO NOTHING;
