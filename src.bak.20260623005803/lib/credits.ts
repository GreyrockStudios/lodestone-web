/**
 * Credit formatting utilities for the Lodestone frontend.
 *
 * All monetary values are stored as cents (integers) internally.
 * 1 credit = $0.01 = 1 cent.
 * Display always uses dollar amounts.
 */

/** Format cents as a dollar string: 150 → "$1.50", -1 → "Unlimited" */
export function formatCredits(cents: number): string {
  if (cents === -1) return "Unlimited";
  if (cents === 0) return "$0.00";
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/** Short format for tight UI: $100+ → whole dollars, under $100 → with cents */
export function formatCreditsShort(cents: number): string {
  if (cents === -1) return "Unlimited";
  if (cents >= 10000) return `$${(cents / 100).toFixed(0)}`; // $100+ → whole dollars
  return `$${(cents / 100).toFixed(2)}`; // Under $100 → with cents
}

/** Format per-message cost in cents to display string: 1 → "$0.01/msg" (legacy) */
export function formatPerMessageCost(cents: number): string {
  if (cents === 0) return "Free";
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}/msg`;
}

/** Format per-1M-token pricing */
export function formatPer1M(price: number): string {
  if (price === 0) return "Free";
  if (price < 0.01) return `$${price.toFixed(4)}/1M`;
  return `$${price.toFixed(2)}/1M`;
}

/** Format input/output price pair for display */
export function formatPricing(inputPer1M: number, outputPer1M: number): string {
  if (inputPer1M === 0 && outputPer1M === 0) return "Free";
  return `$${inputPer1M.toFixed(2)} / $${outputPer1M.toFixed(2)} per 1M tokens`;
}

/** Format short pricing for model picker */
export function formatPricingShort(inputPer1M: number): string {
  if (inputPer1M === 0) return "Free";
  return `from $${inputPer1M.toFixed(2)}/1M`;
}

/** Provider rate info returned by /api/usage/provider-rates */
export interface ProviderRate {
  provider: string;
  model: string;
  inputPer1M: number;
  outputPer1M: number;
  inputPer1MDisplay: string;
  outputPer1MDisplay: string;
  isDefault: boolean;
  /** Legacy fields for backward compat */
  costPerMessage?: number;
  hasKey?: boolean;
}

/** Credit usage data returned by /api/usage/credits */
export interface CreditUsage {
  periodStart: string;
  periodEnd: string;
  plan: string;
  monthlyCredits: number; // cents
  monthlyCreditsDisplay: string; // "$5.00"
  creditsUsed: number; // cents
  creditsUsedDisplay: string;
  creditsRemaining: number; // cents
  creditsRemainingDisplay: string;
  providers: {
    provider: string;
    model: string;
    messages: number;
    promptTokens: number;
    completionTokens: number;
    creditsUsed: number; // cents
    actualCostCents: number;
  }[];
  creditPacksRemaining: number; // cents
  creditPacksRemainingDisplay: string;
  hasByok: Record<string, boolean>;
  pricing?: Record<string, { input_per_1m: string; output_per_1m: string }>;
}
