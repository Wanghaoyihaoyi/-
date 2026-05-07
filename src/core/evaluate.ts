import type { FundConfig, FundEvaluation, FundQuote, RuleConfig } from "./types.js";

export function evaluateFund(
  fund: FundConfig,
  quote: FundQuote | undefined,
  rules: RuleConfig,
  error?: string
): FundEvaluation {
  if (error || !quote) {
    return {
      fund,
      quote,
      status: "error",
      suggestedAmount: 0,
      error: error ?? "missing quote"
    };
  }

  const matchedTier = [...rules.tiers]
    .sort((a, b) => a.maxChangePercent - b.maxChangePercent)
    .find((tier) => quote.changePercent <= tier.maxChangePercent);

  if (matchedTier) {
    return {
      fund,
      quote,
      status: "triggered",
      matchedTier,
      suggestedAmount: fund.baseAmount * matchedTier.multiplier
    };
  }

  if (quote.changePercent <= rules.nearTriggerPercent) {
    return {
      fund,
      quote,
      status: "near",
      suggestedAmount: 0
    };
  }

  return {
    fund,
    quote,
    status: "normal",
    suggestedAmount: 0
  };
}
