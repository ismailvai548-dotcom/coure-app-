import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  bdtToPoisha,
  formatBdtFromPoisha,
  calculateServerCommission,
  calculateRefundAdjustment,
  type CommissionRule,
} from './index.ts';

const MOCK_RULES: CommissionRule[] = [
  {
    id: 'rule-default-10',
    name: 'Platform Default 10%',
    scope: 'platform_default',
    commissionBps: 1000,
    minAllowedBps: 500,
    maxAllowedBps: 2000,
    settlementHoldDays: 7,
    priority: 100,
    isActive: true,
  },
  {
    id: 'rule-instructor-special-8',
    name: 'Partner Instructor 8%',
    scope: 'instructor',
    targetInstructorId: 'inst-partner-1',
    commissionBps: 800,
    minAllowedBps: 500,
    maxAllowedBps: 2000,
    settlementHoldDays: 7,
    priority: 10,
    isActive: true,
  },
  {
    id: 'rule-promo-5',
    name: 'Instructor Attributed Promo 5%',
    scope: 'instructor_promo_attribution',
    commissionBps: 500,
    minAllowedBps: 500,
    maxAllowedBps: 2000,
    settlementHoldDays: 7,
    priority: 1,
    isActive: true,
  },
];

describe('BDT & Poisha Currency Integrity', () => {
  it('converts BDT to integer Poisha without floating-point drift', () => {
    assert.equal(bdtToPoisha(1500), 150000);
    assert.equal(bdtToPoisha(999.5), 99950);
  });

  it('formats Poisha in English and Bengali digits accurately', () => {
    assert.equal(formatBdtFromPoisha(250000, 'en'), '৳2,500');
    assert.equal(formatBdtFromPoisha(250000, 'bn'), '৳২,৫০০');
    assert.equal(formatBdtFromPoisha(0, 'en'), 'Free (৳0)');
  });
});

describe('Configurable Commission Engine', () => {
  it('applies default 10% commission when no specific override matches', () => {
    // 1,500 BDT = 150,000 poisha
    const result = calculateServerCommission(150000, MOCK_RULES, {
      courseId: 'course-1',
      instructorId: 'inst-regular',
      categoryId: 'cat-1',
    });

    assert.equal(result.appliedRuleId, 'rule-default-10');
    assert.equal(result.appliedCommissionBps, 1000);
    assert.equal(result.platformCommissionPoisha, 15000); // 150 BDT
    assert.equal(result.instructorNetPoisha, 135000); // 1,350 BDT
    assert.equal(
      result.platformCommissionPoisha + result.instructorNetPoisha,
      result.grossPaidPoisha
    );
  });

  it('prioritizes instructor-specific rule (8%) over platform default (10%)', () => {
    const result = calculateServerCommission(200000, MOCK_RULES, {
      courseId: 'course-2',
      instructorId: 'inst-partner-1',
      categoryId: 'cat-1',
    });

    assert.equal(result.appliedRuleId, 'rule-instructor-special-8');
    assert.equal(result.appliedCommissionBps, 800);
    assert.equal(result.platformCommissionPoisha, 16000);
    assert.equal(result.instructorNetPoisha, 184000);
  });

  it('prioritizes verified instructor attribution rule (5%) over all others', () => {
    const result = calculateServerCommission(200000, MOCK_RULES, {
      courseId: 'course-2',
      instructorId: 'inst-partner-1',
      categoryId: 'cat-1',
      isInstructorAttributedSale: true,
    });

    assert.equal(result.appliedRuleId, 'rule-promo-5');
    assert.equal(result.appliedCommissionBps, 500);
    assert.equal(result.platformCommissionPoisha, 10000);
    assert.equal(result.instructorNetPoisha, 190000);
  });

  it('reverses exact commission and instructor net on full and partial refunds', () => {
    const fullRefund = calculateRefundAdjustment(150000, {
      grossPaidPoisha: 150000,
      platformCommissionPoisha: 15000,
      instructorNetPoisha: 135000,
    });
    assert.equal(fullRefund.reversedCommissionPoisha, 15000);
    assert.equal(fullRefund.reversedInstructorPoisha, 135000);

    const halfRefund = calculateRefundAdjustment(75000, {
      grossPaidPoisha: 150000,
      platformCommissionPoisha: 15000,
      instructorNetPoisha: 135000,
    });
    assert.equal(halfRefund.reversedCommissionPoisha, 7500);
    assert.equal(halfRefund.reversedInstructorPoisha, 67500);
  });
});
