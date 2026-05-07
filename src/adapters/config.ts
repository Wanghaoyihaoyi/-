import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { FundConfig, RuleConfig } from "../core/types.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export async function loadFunds(path = "config/funds.json"): Promise<FundConfig[]> {
  const content = await readFile(resolve(projectRoot, path), "utf8");
  const funds = JSON.parse(content) as FundConfig[];
  return funds.filter((fund) => fund.enabled);
}

export async function loadRules(path = "config/rules.json"): Promise<RuleConfig> {
  const content = await readFile(resolve(projectRoot, path), "utf8");
  return JSON.parse(content) as RuleConfig;
}
