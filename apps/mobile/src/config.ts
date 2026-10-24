import { formatBdtFromPoisha, type SupportedLocale } from '@bd-course/shared';

/**
 * Shared Mobile Configuration for Android Student App (Phase 5 target).
 * Connects to the exact same Supabase PostgreSQL & Auth project as apps/web.
 * Never embeds service-role keys or payment gateway secrets.
 */
export interface MobileAppEnvironment {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
  defaultLocale: SupportedLocale;
}

export function formatMobileCoursePrice(poisha: number, locale: SupportedLocale = 'bn'): string {
  return formatBdtFromPoisha(poisha, locale);
}
