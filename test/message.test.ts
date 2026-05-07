import { describe, expect, test } from "vitest";
import { formatReminderMessage } from "../src/core/message.js";
import type { FundEvaluation } from "../src/core/types.js";

function evaluation(partial: Partial<FundEvaluation>): FundEvaluation {
  return {
    fund: {
      code: "018043",
      name: "天弘纳斯达克100指数(QDII)A",
      planType: "daily",
      baseAmount: 40,
      enabled: true
    },
    quote: {
      code: "018043",
      changePercent: -2.3,
      dataTime: "2026-05-07 15:00",
      source: "test"
    },
    status: "triggered",
    matchedTier: { maxChangePercent: -2, multiplier: 1 },
    suggestedAmount: 40,
    ...partial
  };
}

describe("formatReminderMessage", () => {
  test("formats triggered funds and total suggested amount", () => {
    const message = formatReminderMessage([evaluation({})], "2026-05-07 14:30", {
      tradingHint: {
        status: "before-cutoff",
        message: "现在仍在交易日 15:00 前，若执行，通常按当天申请处理。"
      },
      autoInvestMode: true
    });

    expect(message).toContain("基金池提醒 2026-05-07 14:30");
    expect(message).toContain("检查基金：1 支");
    expect(message).toContain("自动定投已作为基础仓位");
    expect(message).toContain("触发额外加仓");
    expect(message).toContain("018043 天弘纳斯达克100指数(QDII)A");
    expect(message).toContain("跌幅 -2.30%");
    expect(message).toContain("额外建议 40 元");
    expect(message).toContain("额外建议合计：40 元");
    expect(message).toContain("交易日 15:00 前");
    expect(message).toContain("QDII 多数 T+2 确认");
  });

  test("formats near-trigger funds", () => {
    const message = formatReminderMessage(
      [
        evaluation({
          status: "near",
          matchedTier: undefined,
          suggestedAmount: 0,
          quote: {
            code: "018043",
            changePercent: -1.9,
            dataTime: "2026-05-07 15:00",
            source: "test"
          }
        })
      ],
      "2026-05-07 16:30"
    );

    expect(message).toContain("接近触发");
    expect(message).toContain("跌幅 -1.90%");
    expect(message).toContain("建议合计：0 元");
  });

  test("lists every fund name with its rise or decline", () => {
    const message = formatReminderMessage(
      [
        evaluation({}),
        evaluation({
          fund: {
            code: "270042",
            name: "广发纳斯达克100ETF联接(QDII)A",
            planType: "daily",
            baseAmount: 50,
            enabled: true
          },
          quote: {
            code: "270042",
            changePercent: 1.2,
            dataTime: "2026-05-07 15:00",
            source: "test"
          },
          status: "normal",
          matchedTier: undefined,
          suggestedAmount: 0
        })
      ],
      "2026-05-07 16:30"
    );

    expect(message).toContain("全部基金涨跌：");
    expect(message).toContain("018043 天弘纳斯达克100指数(QDII)A：下跌 -2.30%");
    expect(message).toContain("270042 广发纳斯达克100ETF联接(QDII)A：上涨 +1.20%");
  });

  test("formats data errors", () => {
    const message = formatReminderMessage(
      [
        evaluation({
          status: "error",
          quote: undefined,
          matchedTier: undefined,
          suggestedAmount: 0,
          error: "missing quote"
        })
      ],
      "2026-05-07 16:30"
    );

    expect(message).toContain("数据异常");
    expect(message).toContain("missing quote");
  });

  test("states when no fund is triggered", () => {
    const message = formatReminderMessage(
      [
        evaluation({
          status: "normal",
          matchedTier: undefined,
          suggestedAmount: 0
        })
      ],
      "2026-05-07 16:30"
    );

    expect(message).toContain("触发额外加仓：无");
    expect(message).toContain("接近触发：无");
    expect(message).toContain("数据异常：无");
  });
});
