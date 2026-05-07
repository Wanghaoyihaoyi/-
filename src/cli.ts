import { evaluateFund } from "./core/evaluate.js";
import { formatReminderMessage } from "./core/message.js";
import { loadFunds, loadRules } from "./adapters/config.js";
import { fetchEastmoneyQuote } from "./adapters/eastmoney.js";
import { sendFeishuMessage } from "./adapters/feishu.js";

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const shouldSend = args.has("--send") && !args.has("--dry-run");

  const [funds, rules] = await Promise.all([loadFunds(), loadRules()]);
  const evaluations = await Promise.all(
    funds.map(async (fund) => {
      const result = await fetchEastmoneyQuote(fund.code);
      if (!result.ok) {
        return evaluateFund(fund, undefined, rules, result.error);
      }

      return evaluateFund(fund, result.quote, rules);
    })
  );

  const message = formatReminderMessage(evaluations, formatNow(new Date()));

  if (!shouldSend) {
    console.log(message);
    return;
  }

  if (!rules.feishu) {
    throw new Error("missing feishu config in config/rules.json");
  }

  await sendFeishuMessage(rules.feishu, message);
  console.log("Feishu message sent.");
}

function formatNow(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
