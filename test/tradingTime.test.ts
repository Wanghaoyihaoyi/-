import { describe, expect, test } from "vitest";
import { buildTradingHint } from "../src/core/tradingTime.js";

describe("buildTradingHint", () => {
  test("treats a weekday before cutoff as same-day application window", () => {
    const hint = buildTradingHint(new Date("2026-05-07T14:30:00+08:00"), {
      cutoffHour: 15,
      cutoffMinute: 0
    });

    expect(hint.status).toBe("before-cutoff");
    expect(hint.message).toContain("15:00 前");
    expect(hint.message).toContain("当天申请");
  });

  test("treats a weekday after cutoff as next trading day application", () => {
    const hint = buildTradingHint(new Date("2026-05-07T15:30:00+08:00"), {
      cutoffHour: 15,
      cutoffMinute: 0
    });

    expect(hint.status).toBe("after-cutoff");
    expect(hint.message).toContain("已过 15:00");
    expect(hint.message).toContain("下一交易日");
  });

  test("treats weekends as next trading day application", () => {
    const hint = buildTradingHint(new Date("2026-05-09T10:00:00+08:00"), {
      cutoffHour: 15,
      cutoffMinute: 0
    });

    expect(hint.status).toBe("non-trading-day");
    expect(hint.message).toContain("非交易日");
    expect(hint.message).toContain("下一交易日");
  });
});
