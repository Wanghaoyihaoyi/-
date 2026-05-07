import type { TradingCutoff, TradingHint } from "./types.js";

export function buildTradingHint(now: Date, cutoff: TradingCutoff): TradingHint {
  const cutoffText = formatCutoff(cutoff);
  const day = now.getDay();

  if (day === 0 || day === 6) {
    return {
      status: "non-trading-day",
      message: `当前为非交易日；若现在提交，通常按下一交易日申请处理。QDII 多数 T+2 确认份额。`
    };
  }

  const minutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = cutoff.cutoffHour * 60 + cutoff.cutoffMinute;

  if (minutes < cutoffMinutes) {
    return {
      status: "before-cutoff",
      message: `现在仍在交易日 ${cutoffText} 前，若执行，通常按当天申请处理；QDII 多数 T+2 确认份额。`
    };
  }

  return {
    status: "after-cutoff",
    message: `当前已过 ${cutoffText}，若现在提交，通常顺延到下一交易日申请；QDII 多数 T+2 确认份额。`
  };
}

function formatCutoff(cutoff: TradingCutoff): string {
  return `${String(cutoff.cutoffHour).padStart(2, "0")}:${String(cutoff.cutoffMinute).padStart(2, "0")}`;
}
