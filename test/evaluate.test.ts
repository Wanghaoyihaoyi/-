import { describe, expect, test } from "vitest";
import { evaluateFund } from "../src/core/evaluate.js";
import type { FundConfig, FundQuote, RuleConfig } from "../src/core/types.js";

const fund: FundConfig = {
  code: "018043",
  name: "天弘纳斯达克100指数(QDII)A",
  planType: "daily",
  baseAmount: 40,
  enabled: true
};

const rules: RuleConfig = {
  tiers: [
    { maxChangePercent: -2, multiplier: 1 },
    { maxChangePercent: -4, multiplier: 2 },
    { maxChangePercent: -6, multiplier: 3 }
  ],
  nearTriggerPercent: -1.8
};

function quote(changePercent: number): FundQuote {
  return {
    code: fund.code,
    changePercent,
    dataTime: "2026-05-07 15:00",
    source: "test"
  };
}

describe("evaluateFund", () => {
  test("does not trigger before the near-trigger band", () => {
    expect(evaluateFund(fund, quote(-1.7), rules)).toMatchObject({
      status: "normal",
      suggestedAmount: 0
    });
  });

  test("marks a fund as near-trigger when it is close to the first tier", () => {
    expect(evaluateFund(fund, quote(-1.9), rules)).toMatchObject({
      status: "near",
      suggestedAmount: 0
    });
  });

  test("uses 1x base amount at a 2 percent decline", () => {
    expect(evaluateFund(fund, quote(-2), rules)).toMatchObject({
      status: "triggered",
      suggestedAmount: 40,
      matchedTier: { maxChangePercent: -2, multiplier: 1 }
    });
  });

  test("uses 2x base amount at a 4 percent decline", () => {
    expect(evaluateFund(fund, quote(-4), rules)).toMatchObject({
      status: "triggered",
      suggestedAmount: 80,
      matchedTier: { maxChangePercent: -4, multiplier: 2 }
    });
  });

  test("uses 3x base amount at a 6 percent decline", () => {
    expect(evaluateFund(fund, quote(-6), rules)).toMatchObject({
      status: "triggered",
      suggestedAmount: 120,
      matchedTier: { maxChangePercent: -6, multiplier: 3 }
    });
  });

  test("reports data errors without a buy suggestion", () => {
    expect(evaluateFund(fund, undefined, rules, "missing quote")).toMatchObject({
      status: "error",
      suggestedAmount: 0,
      error: "missing quote"
    });
  });
});
