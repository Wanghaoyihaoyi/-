import type { FundEvaluation, TradingHint } from "./types.js";

export interface ReminderMessageOptions {
  autoInvestMode?: boolean;
  tradingHint?: TradingHint;
}

export function formatReminderMessage(
  evaluations: FundEvaluation[],
  nowText: string,
  options: ReminderMessageOptions = {}
): string {
  const triggered = evaluations.filter((item) => item.status === "triggered");
  const near = evaluations.filter((item) => item.status === "near");
  const errors = evaluations.filter((item) => item.status === "error");
  const totalSuggestedAmount = triggered.reduce((sum, item) => sum + item.suggestedAmount, 0);
  const tradingMessage =
    options.tradingHint?.message ??
    "交易日 15:00 前提交通常按当天申请处理，15:00 后通常顺延到下一交易日；QDII 多数 T+2 确认份额。";

  return [
    `基金池提醒 ${nowText}`,
    `检查基金：${evaluations.length} 支`,
    options.autoInvestMode ? "自动定投已作为基础仓位，以下只计算额外加仓建议。" : undefined,
    "",
    formatTriggered(triggered),
    "",
    formatNear(near),
    "",
    formatErrors(errors),
    "",
    `额外建议合计：${totalSuggestedAmount} 元`,
    `交易提示：${tradingMessage}`,
    "确认提示：普通基金通常 T+1 确认份额，QDII 多数 T+2 确认份额。",
    "风险提示：QDII 净值/估值可能延迟，本提醒只做加仓参考，不自动购买。"
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

function formatTriggered(items: FundEvaluation[]): string {
  if (items.length === 0) {
    return "触发额外加仓：无";
  }

  return [
    "触发额外加仓：",
    ...items.map((item, index) => {
      const change = formatPercent(item.quote?.changePercent);
      const tier = item.matchedTier ? `${item.matchedTier.multiplier}x` : "-";
      const dataTime = item.quote?.dataTime ?? "未知时间";
      return `${index + 1}. ${item.fund.code} ${item.fund.name}：跌幅 ${change}，档位 ${tier}，额外建议 ${item.suggestedAmount} 元，数据 ${dataTime}`;
    })
  ].join("\n");
}

function formatNear(items: FundEvaluation[]): string {
  if (items.length === 0) {
    return "接近触发：无";
  }

  return [
    "接近触发：",
    ...items.map((item, index) => {
      const change = formatPercent(item.quote?.changePercent);
      const dataTime = item.quote?.dataTime ?? "未知时间";
      return `${index + 1}. ${item.fund.code} ${item.fund.name}：跌幅 ${change}，数据 ${dataTime}`;
    })
  ].join("\n");
}

function formatErrors(items: FundEvaluation[]): string {
  if (items.length === 0) {
    return "数据异常：无";
  }

  return [
    "数据异常：",
    ...items.map((item, index) => `${index + 1}. ${item.fund.code} ${item.fund.name}：${item.error ?? "unknown error"}`)
  ].join("\n");
}

function formatPercent(value: number | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "未知";
  }

  return `${value.toFixed(2)}%`;
}
