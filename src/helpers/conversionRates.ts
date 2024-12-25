/**
 * Conversion rates between time periods.
 * - `hourly`: The value for 1 hour.
 * - `daily`: Calculated based on an 8-hour workday.
 * - `weekly`: Based on a 40-hour workweek (5 days * 8 hours).
 * - `monthly`: Based on 12 months in a year (160 hours).
 * - `yearly`: Based on 52 working weeks per year (2080 hours).
 */
export const conversionRates: Record<string, Record<string, number>> = {
  default: {
    hourly: 1,
    daily: 8,
    weekly: 40,
    monthly: 40 * 4.3,
    annually: 8 * 260,
  },
  hourly: { daily: 8, weekly: 40, monthly: 40 * 4.3, annually: 8 * 260 },
  daily: { hourly: 1 / 8, weekly: 5, monthly: 22, annually: 260 },
  weekly: { hourly: 1 / 40, daily: 1 / 5, monthly: 4.3, annually: 52 },
  monthly: {
    hourly: 1 / (40 * 4),
    daily: 1 / 22,
    weekly: 1 / 4.3,
    annually: 12,
  },
  annually: {
    hourly: 1 / 2080,
    daily: 1 / 260,
    weekly: 1 / 52,
    monthly: 1 / 12,
  },
};
