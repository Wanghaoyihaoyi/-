export type PlanType = "daily" | "weekly";

export interface FundConfig {
  code: string;
  name: string;
  planType: PlanType;
  baseAmount: number;
  enabled: boolean;
}

export interface DeclineTier {
  maxChangePercent: number;
  multiplier: number;
}

export interface RuleConfig {
  tiers: DeclineTier[];
  nearTriggerPercent: number;
  feishu?: FeishuConfig;
}

export interface FeishuConfig {
  ccConnectPath: string;
  dataDir?: string;
  project: string;
  session?: string;
}

export interface FundQuote {
  code: string;
  changePercent: number;
  dataTime: string;
  source: string;
}

export type EvaluationStatus = "triggered" | "near" | "normal" | "error";

export interface FundEvaluation {
  fund: FundConfig;
  quote?: FundQuote;
  status: EvaluationStatus;
  matchedTier?: DeclineTier;
  suggestedAmount: number;
  error?: string;
}
