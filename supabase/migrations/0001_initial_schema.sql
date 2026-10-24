-- =============================================================================
-- Migration: 0001_initial_schema.sql
-- Project: Bangladesh Multi-Vendor Course Marketplace
-- Description: Normalized PostgreSQL schema with integer minor-unit (poisha)
--              financial columns, idempotency constraints, and auditability.
--              1 BDT = 100 Poisha. 1% = 100 Basis Points (bps).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE app_role AS ENUM (
  'student',
  'instructor',
  'organization_admin',
  'admin'
);

CREATE TYPE verification_status AS ENUM (
  'pending',
  'under_review',
  'approved',
  'rejected',
  'suspended'
);

CREATE TYPE course_status AS ENUM (
  'draft',
  'submitted',
  'approved',
  'rejected',
  'published',
  'suspended',
  'archived'
);

CREATE TYPE course_delivery_mode AS ENUM (
  'recorded',
  'hybrid',
  'live_cohort'
);

CREATE TYPE lesson_type AS ENUM (
  'video',
  'text',
  'pdf',
  'quiz',
  'assignment',
  'live_session_placeholder'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded'
);

CREATE TYPE payment_status AS ENUM (
  'initiated',
  'pending_verification',
  'verified',
  'failed',
  'refunded',
  'chargeback'
);

CREATE TYPE ledger_entry_type AS ENUM (
  'sale_credit',
  'platform_commission',
  'gateway_fee',
  'refund_debit',
  'commission_reversal',
  'payout_hold',
  'payout_release',
  'payout_settled',
  'manual_adjustment'
);

CREATE TYPE payout_status AS ENUM (
  'requested',
  'under_review',
  'approved',
  'processing',
  'paid',
  'rejected',
  'cancelled'
);

CREATE TYPE commission_scope AS ENUM (
  'platform_default',
  'category',
  'organization',
  'instructor',
  'course',
  'instructor_promo_attribution'
);

-- -----------------------------------------------------------------------------
-- 2. PROFILES & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone_e164 TEXT UNIQUE,
  full_name TEXT NOT NULL,
  full_name_bn TEXT,
  avatar_url TEXT,
  preferred_locale TEXT NOT NULL DEFAULT 'bn' CHECK (preferred_locale IN ('bn', 'en')),
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  suspended_reason TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- -----------------------------------------------------------------------------
-- 3. ORGANIZATIONS & INSTRUCTOR PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  name_bn TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  trade_license_no TEXT,
  tin_certificate_no TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL DEFAULT 'instructor' CHECK (member_role IN ('owner', 'manager', 'instructor')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE instructor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  headline_bn TEXT,
  bio TEXT,
  bio_bn TEXT,
  expertise_tags TEXT[] NOT NULL DEFAULT '{}',
  nid_or_passport_ref TEXT,
  payout_method_summary JSONB NOT NULL DEFAULT '{}'::jsonb, -- non-secret display metadata (e.g., masked bank/bKash account)
  verification_status verification_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  total_students_count INTEGER NOT NULL DEFAULT 0 CHECK (total_students_count >= 0),
  average_rating NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. CATEGORIES & COURSES
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  description_en TEXT,
  description_bn TEXT,
  icon_name TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_bn TEXT,
  subtitle_en TEXT,
  subtitle_bn TEXT,
  description_en TEXT NOT NULL,
  description_bn TEXT,
  language TEXT NOT NULL DEFAULT 'bn' CHECK (language IN ('bn', 'en', 'mixed')),
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  delivery_mode course_delivery_mode NOT NULL DEFAULT 'recorded',
  thumbnail_url TEXT,
  preview_video_id TEXT,
  -- All monetary values in Poisha (1 BDT = 100 Poisha)
  price_poisha BIGINT NOT NULL CHECK (price_poisha >= 0),
  discount_price_poisha BIGINT CHECK (discount_price_poisha IS NULL OR (discount_price_poisha >= 0 AND discount_price_poisha <= price_poisha)),
  learning_objectives TEXT[] NOT NULL DEFAULT '{}',
  target_audience TEXT[] NOT NULL DEFAULT '{}',
  status course_status NOT NULL DEFAULT 'draft',
  review_feedback TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  enrollment_count INTEGER NOT NULL DEFAULT 0 CHECK (enrollment_count >= 0),
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  -- Future live-course extensibility metadata
  live_schedule_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_status_category ON courses(status, category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_slug ON courses(slug);

CREATE TABLE course_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_text TEXT NOT NULL,
  required_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_course_sections_course ON course_sections(course_id, display_order);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_type lesson_type NOT NULL DEFAULT 'video',
  content_markdown TEXT,
  video_storage_key TEXT,
  video_duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (video_duration_seconds >= 0),
  is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  quiz_payload JSONB,
  live_session_metadata JSONB, -- Designed for future live-class integration
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_course_section ON lessons(course_id, section_id, display_order);

CREATE TABLE lesson_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  storage_bucket_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes >= 0),
  is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. COUPONS, ORDERS & PAYMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK ( code = UPPER(code) ),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_poisha')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  max_discount_poisha BIGINT,
  min_order_poisha BIGINT NOT NULL DEFAULT 0,
  is_instructor_attributed BOOLEAN NOT NULL DEFAULT FALSE,
  max_redemptions INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0 CHECK (redemption_count >= 0),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BDT' CHECK (currency = 'BDT'),
  subtotal_poisha BIGINT NOT NULL CHECK (subtotal_poisha >= 0),
  discount_poisha BIGINT NOT NULL DEFAULT 0 CHECK (discount_poisha >= 0),
  total_poisha BIGINT NOT NULL CHECK (total_poisha >= 0 AND total_poisha = subtotal_poisha - discount_poisha),
  status order_status NOT NULL DEFAULT 'pending',
  purchase_channel TEXT NOT NULL DEFAULT 'web' CHECK (purchase_channel IN ('web', 'android')),
  idempotency_key TEXT UNIQUE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_student ON orders(student_id, created_at DESC);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  unit_price_poisha BIGINT NOT NULL CHECK (unit_price_poisha >= 0),
  discount_allocated_poisha BIGINT NOT NULL DEFAULT 0 CHECK (discount_allocated_poisha >= 0),
  gross_paid_poisha BIGINT NOT NULL CHECK (gross_paid_poisha >= 0 AND gross_paid_poisha = unit_price_poisha - discount_allocated_poisha),
  applied_commission_rule_id UUID,
  applied_commission_bps INTEGER NOT NULL CHECK (applied_commission_bps >= 0 AND applied_commission_bps <= 10000),
  platform_commission_poisha BIGINT NOT NULL CHECK (platform_commission_poisha >= 0),
  instructor_net_poisha BIGINT NOT NULL CHECK (instructor_net_poisha >= 0 AND platform_commission_poisha + instructor_net_poisha = gross_paid_poisha),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, course_id)
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL CHECK (provider IN ('sslcommerz', 'bkash', 'nagad', 'google_play_billing', 'mock_sandbox')),
  provider_session_id TEXT,
  provider_transaction_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE NOT NULL,
  amount_poisha BIGINT NOT NULL CHECK (amount_poisha >= 0),
  gateway_fee_poisha BIGINT NOT NULL DEFAULT 0 CHECK (gateway_fee_poisha >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'BDT',
  status payment_status NOT NULL DEFAULT 'initiated',
  verified_via TEXT CHECK (verified_via IN ('ipn_webhook', 'server_validation_api', 'mock_dev_verify')),
  raw_verification_summary JSONB NOT NULL DEFAULT '{}'::jsonb, -- sanitized metadata, NEVER raw secrets/card numbers
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. ENROLLMENTS & PROGRESS
-- -----------------------------------------------------------------------------
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  order_item_id UUID UNIQUE REFERENCES order_items(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked_refund', 'suspended')),
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE (course_id, student_id)
);

CREATE INDEX idx_enrollments_student ON course_enrollments(student_id, status);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id, status);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  watched_seconds INTEGER NOT NULL DEFAULT 0 CHECK (watched_seconds >= 0),
  last_position_seconds INTEGER NOT NULL DEFAULT 0 CHECK (last_position_seconds >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, lesson_id)
);

-- -----------------------------------------------------------------------------
-- 7. COMMISSION RULES, LEDGER, REFUNDS & PAYOUTS
-- -----------------------------------------------------------------------------
CREATE TABLE commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scope commission_scope NOT NULL,
  target_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  target_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  target_instructor_id UUID REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  target_course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  -- Commission in Basis Points: 1000 bps = 10.00%, min/max bounds enforced by policy
  commission_bps INTEGER NOT NULL DEFAULT 1000 CHECK (commission_bps >= 0 AND commission_bps <= 5000),
  min_allowed_bps INTEGER NOT NULL DEFAULT 500 CHECK (min_allowed_bps >= 0),
  max_allowed_bps INTEGER NOT NULL DEFAULT 2000 CHECK (max_allowed_bps <= 10000),
  settlement_hold_days INTEGER NOT NULL DEFAULT 7 CHECK (settlement_hold_days >= 0),
  priority INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_commission_bounds CHECK (commission_bps >= min_allowed_bps AND commission_bps <= max_allowed_bps)
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  refund_amount_poisha BIGINT NOT NULL CHECK (refund_amount_poisha > 0),
  reversed_commission_poisha BIGINT NOT NULL CHECK (reversed_commission_poisha >= 0),
  reversed_instructor_poisha BIGINT NOT NULL CHECK (reversed_instructor_poisha >= 0),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'processed')),
  processed_by UUID REFERENCES profiles(id),
  idempotency_key TEXT UNIQUE NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APPEND-ONLY FINANCIAL LEDGER: Every credit/debit is recorded immutably
CREATE TABLE commission_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  entry_type ledger_entry_type NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE RESTRICT,
  order_item_id UUID REFERENCES order_items(id) ON DELETE RESTRICT,
  refund_id UUID REFERENCES refunds(id) ON DELETE RESTRICT,
  payout_request_id UUID,
  instructor_id UUID REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  gross_amount_poisha BIGINT NOT NULL DEFAULT 0,
  platform_commission_poisha BIGINT NOT NULL DEFAULT 0,
  instructor_delta_poisha BIGINT NOT NULL DEFAULT 0, -- positive for credit, negative for debit/refund/payout
  currency CHAR(3) NOT NULL DEFAULT 'BDT',
  description TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commission_ledger_instructor ON commission_ledger(instructor_id, created_at DESC);

CREATE TABLE instructor_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  order_item_id UUID UNIQUE NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  gross_sale_poisha BIGINT NOT NULL CHECK (gross_sale_poisha >= 0),
  commission_bps INTEGER NOT NULL,
  platform_commission_poisha BIGINT NOT NULL CHECK (platform_commission_poisha >= 0),
  net_earning_poisha BIGINT NOT NULL CHECK (net_earning_poisha >= 0),
  refunded_poisha BIGINT NOT NULL DEFAULT 0 CHECK (refunded_poisha >= 0),
  status TEXT NOT NULL DEFAULT 'pending_maturity' CHECK (status IN ('pending_maturity', 'available', 'reserved_for_payout', 'paid_out', 'refunded')),
  matures_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_instructor_earnings_status ON instructor_earnings(instructor_id, status, matures_at);

CREATE TABLE payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  amount_poisha BIGINT NOT NULL CHECK (amount_poisha > 0),
  payout_method TEXT NOT NULL CHECK (payout_method IN ('bank_transfer_bd', 'bkash_merchant_disbursement', 'nagad_disbursement')),
  destination_summary JSONB NOT NULL,
  status payout_status NOT NULL DEFAULT 'requested',
  idempotency_key TEXT UNIQUE NOT NULL,
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payout_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_request_id UUID UNIQUE NOT NULL REFERENCES payout_requests(id) ON DELETE RESTRICT,
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
  amount_poisha BIGINT NOT NULL CHECK (amount_poisha > 0),
  bank_or_mfs_reference TEXT NOT NULL,
  executed_by UUID NOT NULL REFERENCES profiles(id),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. REVIEWS, WISHLISTS, NOTIFICATIONS, SUPPORT & GOVERNANCE
-- -----------------------------------------------------------------------------
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, student_id)
);

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, course_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  related_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('payment', 'refund', 'course_quality', 'technical', 'instructor_dispute', 'account')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE copyright_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_email TEXT NOT NULL,
  target_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  target_lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  original_work_proof_url TEXT NOT NULL,
  statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'investigating', 'takedown_executed', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  previous_state JSONB,
  new_state JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 9. IMMUTABILITY TRIGGERS FOR LEDGER & AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_immutable_table_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Table % is append-only and cannot be updated or deleted.', TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER trg_commission_ledger_immutable
BEFORE UPDATE OR DELETE ON commission_ledger
FOR EACH ROW EXECUTE FUNCTION prevent_immutable_table_modification();

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_immutable_table_modification();
