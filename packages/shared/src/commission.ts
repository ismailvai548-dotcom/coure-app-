import type { CommissionRule } from './types.ts';

export interface CommissionContext {
  courseId: string;
  instructorId: string;
  organizationId?: string | null;
  categoryId: string;
  isInstructorAttributedSale?: boolean;
}

export interface CommissionBreakdown {
  appliedRuleId: string;
  appliedRuleName: string;
  appliedCommissionBps: number;
  grossPaidPoisha: number;
  platformCommissionPoisha: number;
  instructorNetPoisha: number;
  settlementHoldDays: number;
}

/**
 * Resolves the highest-precedence active commission rule from database-configured rules
 * and computes exact integer-poisha commission and instructor earnings.
 *
 * Precedence order (most specific wins, then lowest priority number):
 * 1. instructor_promo_attribution (when sale is verified instructor attribution)
 * 2. course
 * 3. instructor
 * 4. organization
 * 5. category
 * 6. platform_default
 */
export function calculateServerCommission(
  grossPaidPoisha: number,
  configuredRules: CommissionRule[],
  context: CommissionContext
): CommissionBreakdown {
  if (!Number.isSafeInteger(grossPaidPoisha) || grossPaidPoisha < 0) {
    throw new Error(`grossPaidPoisha must be a non-negative integer, got ${grossPaidPoisha}`);
  }

  const activeRules = configuredRules.filter((r) => r.isActive);
  if (activeRules.length === 0) {
    throw new Error('No active commission rules configured. Financial processing aborted.');
  }

  const matchingRules = activeRules.filter((rule) => {
    switch (rule.scope) {
      case 'instructor_promo_attribution':
        return Boolean(context.isInstructorAttributedSale);
      case 'course':
        return rule.targetCourseId === context.courseId;
      case 'instructor':
        return rule.targetInstructorId === context.instructorId;
      case 'organization':
        return Boolean(context.organizationId && rule.targetOrganizationId === context.organizationId);
      case 'category':
        return rule.targetCategoryId === context.categoryId;
      case 'platform_default':
        return true;
      default:
        return false;
    }
  });

  const scopeRank: Record<CommissionRule['scope'], number> = {
    instructor_promo_attribution: 1,
    course: 2,
    instructor: 3,
    organization: 4,
    category: 5,
    platform_default: 6,
  };

  matchingRules.sort((a, b) => {
    const rankDiff = scopeRank[a.scope] - scopeRank[b.scope];
    if (rankDiff !== 0) return rankDiff;
    return a.priority - b.priority;
  });

  const selectedRule = matchingRules[0];
  if (!selectedRule) {
    throw new Error('No matching or fallback platform_default commission rule found.');
  }

  if (
    selectedRule.commissionBps < selectedRule.minAllowedBps ||
    selectedRule.commissionBps > selectedRule.maxAllowedBps
  ) {
    throw new Error(
      `Commission rule "${selectedRule.name}" (${selectedRule.commissionBps} bps) violates configured bounds [${selectedRule.minAllowedBps}, ${selectedRule.maxAllowedBps}] bps.`
    );
  }

  // Exact integer arithmetic: half-up rounding to nearest Poisha
  const platformCommissionPoisha = Math.floor(
    (grossPaidPoisha * selectedRule.commissionBps + 5000) / 10000
  );
  const instructorNetPoisha = grossPaidPoisha - platformCommissionPoisha;

  return {
    appliedRuleId: selectedRule.id,
    appliedRuleName: selectedRule.name,
    appliedCommissionBps: selectedRule.commissionBps,
    grossPaidPoisha,
    platformCommissionPoisha,
    instructorNetPoisha,
    settlementHoldDays: selectedRule.settlementHoldDays,
  };
}

/**
 * Calculates proportional commission and instructor clawback on full or partial refund.
 */
export function calculateRefundAdjustment(
  refundAmountPoisha: number,
  originalOrderItem: {
    grossPaidPoisha: number;
    platformCommissionPoisha: number;
    instructorNetPoisha: number;
  }
): {
  refundAmountPoisha: number;
  reversedCommissionPoisha: number;
  reversedInstructorPoisha: number;
} {
  if (
    !Number.isSafeInteger(refundAmountPoisha) ||
    refundAmountPoisha <= 0 ||
    refundAmountPoisha > originalOrderItem.grossPaidPoisha
  ) {
    throw new Error('Invalid refund amount relative to original order item.');
  }

  if (refundAmountPoisha === originalOrderItem.grossPaidPoisha) {
    return {
      refundAmountPoisha,
      reversedCommissionPoisha: originalOrderItem.platformCommissionPoisha,
      reversedInstructorPoisha: originalOrderItem.instructorNetPoisha,
    };
  }

  const reversedCommissionPoisha = Math.floor(
    (refundAmountPoisha * originalOrderItem.platformCommissionPoisha) /
      originalOrderItem.grossPaidPoisha
  );
  const reversedInstructorPoisha = refundAmountPoisha - reversedCommissionPoisha;

  return {
    refundAmountPoisha,
    reversedCommissionPoisha,
    reversedInstructorPoisha,
  };
}
