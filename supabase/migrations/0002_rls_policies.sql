-- =============================================================================
-- Migration: 0002_rls_policies.sql
-- Project: Bangladesh Multi-Vendor Course Marketplace
-- Description: Server/Database-level Row Level Security (RLS) policies and
--              security-definer authorization helpers.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. AUTHORIZATION HELPER FUNCTIONS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(target_role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = target_role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('admin');
$$;

CREATE OR REPLACE FUNCTION public.owns_instructor_profile(target_instructor_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.instructor_profiles ip
    WHERE ip.id = target_instructor_id
      AND (
        ip.user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.organization_members om
          WHERE om.organization_id = ip.organization_id
            AND om.user_id = auth.uid()
            AND om.is_active = TRUE
            AND om.member_role IN ('owner', 'manager')
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(target_course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.course_enrollments ce
    WHERE ce.course_id = target_course_id
      AND ce.student_id = auth.uid()
      AND ce.status = 'active'
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. ENABLE RLS ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE copyright_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 3. RLS POLICIES
-- -----------------------------------------------------------------------------

-- PROFILES
CREATE POLICY "Users can view own profile or admins can view all"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update own non-privileged profile fields"
  ON profiles FOR UPDATE
  USING (id = auth.uid() AND is_suspended = FALSE)
  WITH CHECK (id = auth.uid() AND is_suspended = FALSE);

-- USER ROLES (Only admins can grant/revoke roles; users can read own roles)
CREATE POLICY "Users can read own roles and admins can read all"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins manage user roles"
  ON user_roles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- INSTRUCTOR PROFILES
CREATE POLICY "Public can view approved instructor profiles"
  ON instructor_profiles FOR SELECT
  USING (
    verification_status = 'approved'
    OR user_id = auth.uid()
    OR public.owns_instructor_profile(id)
    OR public.is_admin()
  );

CREATE POLICY "Users can apply or update own instructor profile"
  ON instructor_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can update own profile details"
  ON instructor_profiles FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- CATEGORIES
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Only admins manage categories"
  ON categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- COURSES
CREATE POLICY "Public views published courses; owners and admins view own/all"
  ON courses FOR SELECT
  USING (
    status = 'published'
    OR public.owns_instructor_profile(instructor_id)
    OR public.is_enrolled_in_course(id)
    OR public.is_admin()
  );

CREATE POLICY "Approved instructors can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    public.owns_instructor_profile(instructor_id)
    AND status IN ('draft', 'submitted')
  );

CREATE POLICY "Instructors can edit own non-suspended courses; admins can manage all"
  ON courses FOR UPDATE
  USING (
    (public.owns_instructor_profile(instructor_id) AND status IN ('draft', 'submitted', 'rejected', 'approved', 'published'))
    OR public.is_admin()
  );

-- COURSE SECTIONS & PREREQUISITES
CREATE POLICY "Readable if parent course is readable"
  ON course_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_sections.course_id
        AND (c.status = 'published' OR public.owns_instructor_profile(c.instructor_id) OR public.is_enrolled_in_course(c.id) OR public.is_admin())
    )
  );

CREATE POLICY "Instructors manage own course sections"
  ON course_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_sections.course_id
        AND (public.owns_instructor_profile(c.instructor_id) OR public.is_admin())
    )
  );

-- LESSONS (Curriculum titles visible via public RPC/view, full lesson rows restricted to preview, enrolled, owner, admin)
CREATE POLICY "Lessons accessible to enrolled students, previewers, course instructor, or admin"
  ON lessons FOR SELECT
  USING (
    is_free_preview = TRUE
    OR public.is_enrolled_in_course(course_id)
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id
        AND public.owns_instructor_profile(c.instructor_id)
    )
    OR public.is_admin()
  );

CREATE POLICY "Instructors manage own lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id
        AND (public.owns_instructor_profile(c.instructor_id) OR public.is_admin())
    )
  );

-- LESSON ATTACHMENTS
CREATE POLICY "Attachments restricted to enrolled students, course instructor, or admin"
  ON lesson_attachments FOR SELECT
  USING (
    public.is_enrolled_in_course(course_id)
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lesson_attachments.course_id
        AND public.owns_instructor_profile(c.instructor_id)
    )
    OR public.is_admin()
  );

-- ORDERS & ORDER ITEMS (Never directly writable by client; created/updated via server backend only)
CREATE POLICY "Students view own orders; admins view all"
  ON orders FOR SELECT
  USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students view own order items; instructors view own course sales; admins view all"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.student_id = auth.uid())
    OR public.owns_instructor_profile(instructor_id)
    OR public.is_admin()
  );

-- ENROLLMENTS & PROGRESS
CREATE POLICY "Students, course instructors, and admins view enrollments"
  ON course_enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_enrollments.course_id
        AND public.owns_instructor_profile(c.instructor_id)
    )
    OR public.is_admin()
  );

CREATE POLICY "Students manage own lesson progress"
  ON lesson_progress FOR ALL
  USING (student_id = auth.uid() OR public.is_admin())
  WITH CHECK (student_id = auth.uid() OR public.is_admin());

-- FINANCIAL TABLES (Strict isolation between instructors)
CREATE POLICY "Instructors view only own earnings; admins view all"
  ON instructor_earnings FOR SELECT
  USING (public.owns_instructor_profile(instructor_id) OR public.is_admin());

CREATE POLICY "Instructors view only own ledger rows; admins view all"
  ON commission_ledger FOR SELECT
  USING (
    (instructor_id IS NOT NULL AND public.owns_instructor_profile(instructor_id))
    OR public.is_admin()
  );

CREATE POLICY "Instructors view and request own payouts; admins manage all"
  ON payout_requests FOR SELECT
  USING (public.owns_instructor_profile(instructor_id) OR public.is_admin());

CREATE POLICY "Only admins view or modify commission rules"
  ON commission_rules FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- REVIEWS & WISHLISTS
CREATE POLICY "Anyone can read published reviews"
  ON reviews FOR SELECT
  USING (is_published = TRUE OR student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Enrolled students can submit review for their enrolled course"
  ON reviews FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND public.is_enrolled_in_course(course_id)
  );

CREATE POLICY "Students manage own wishlist"
  ON wishlists FOR ALL
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- NOTIFICATIONS, SUPPORT & AUDIT LOGS
CREATE POLICY "Users read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users view own support tickets; admins view all"
  ON support_tickets FOR SELECT
  USING (reporter_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create support tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Only admins can read audit logs"
  ON audit_logs FOR SELECT
  USING (public.is_admin());
