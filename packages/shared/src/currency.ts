/**
 * Currency & Minor-Unit (Poisha) Utilities for Bangladeshi Taka (BDT).
 * 1 BDT = 100 Poisha.
 * All financial storage and arithmetic use integer Poisha to prevent floating-point errors.
 */

export const POISHA_PER_BDT = 100;

export function bdtToPoisha(bdtAmount: number): number {
  if (!Number.isFinite(bdtAmount) || bdtAmount < 0) {
    throw new Error(`Invalid BDT amount: ${bdtAmount}`);
  }
  return Math.round(bdtAmount * POISHA_PER_BDT);
}

export function poishaToBdtString(poisha: number): string {
  if (!Number.isSafeInteger(poisha)) {
    throw new Error(`Poisha amount must be a safe integer, received: ${poisha}`);
  }
  const wholeBdt = Math.trunc(poisha / POISHA_PER_BDT);
  const remainderPoisha = Math.abs(poisha % POISHA_PER_BDT);
  if (remainderPoisha === 0) {
    return wholeBdt.toLocaleString('en-BD');
  }
  return `${wholeBdt.toLocaleString('en-BD')}.${remainderPoisha.toString().padStart(2, '0')}`;
}

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => EN_TO_BN_DIGITS[digit] ?? digit);
}

export function formatBdtFromPoisha(
  poisha: number,
  locale: 'bn' | 'en' = 'bn'
): string {
  if (poisha === 0) {
    return locale === 'bn' ? 'ফ্রি (৳০)' : 'Free (৳0)';
  }
  const formatted = poishaToBdtString(poisha);
  return locale === 'bn' ? `৳${toBengaliDigits(formatted)}` : `৳${formatted}`;
}
