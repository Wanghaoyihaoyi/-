import type { FundQuote } from "../core/types.js";

interface EastmoneyPayload {
  fundcode?: string;
  gszzl?: string;
  gztime?: string;
}

interface EastmoneyLsjzPayload {
  Data?: {
    LSJZList?: Array<{
      FSRQ?: string;
      JZZZL?: string;
    }>;
  };
  ErrCode?: number;
  ErrMsg?: string | null;
}

export type QuoteResult =
  | { ok: true; quote: FundQuote }
  | { ok: false; error: string };

export async function fetchEastmoneyQuote(code: string): Promise<QuoteResult> {
  const quoteUrl = `https://fundgz.1234567.com.cn/js/${encodeURIComponent(code)}.js?rt=${Date.now()}`;

  try {
    const response = await fetch(quoteUrl, {
      headers: {
        "user-agent": "fund-reminder/0.1"
      }
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    return { ok: true, quote: parseEastmoneyJsonp(await response.text(), code) };
  } catch (error) {
    return fetchEastmoneyHistoricalQuote(code, error instanceof Error ? error.message : String(error));
  }
}

export function parseEastmoneyJsonp(text: string, expectedCode: string): FundQuote {
  const match = text.trim().match(/^jsonpgz\((.*)\);?$/s);
  if (!match) {
    throw new Error("invalid JSONP response");
  }

  const payload = JSON.parse(match[1]) as EastmoneyPayload;

  if (payload.fundcode !== expectedCode) {
    throw new Error(`fund code mismatch: expected ${expectedCode}, got ${payload.fundcode ?? "empty"}`);
  }

  if (!payload.gszzl) {
    throw new Error("missing gszzl");
  }

  const changePercent = Number(payload.gszzl);
  if (!Number.isFinite(changePercent)) {
    throw new Error(`invalid gszzl: ${payload.gszzl}`);
  }

  return {
    code: expectedCode,
    changePercent,
    dataTime: payload.gztime ?? "unknown",
    source: "eastmoney"
  };
}

async function fetchEastmoneyHistoricalQuote(code: string, primaryError: string): Promise<QuoteResult> {
  const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${encodeURIComponent(code)}&pageIndex=1&pageSize=3`;

  try {
    const response = await fetch(url, {
      headers: {
        referer: "https://fundf10.eastmoney.com/",
        "user-agent": "fund-reminder/0.1"
      }
    });

    if (!response.ok) {
      return { ok: false, error: `${primaryError}; fallback HTTP ${response.status}` };
    }

    return { ok: true, quote: parseEastmoneyLsjz(await response.text(), code) };
  } catch (error) {
    const fallbackError = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `${primaryError}; fallback ${fallbackError}` };
  }
}

export function parseEastmoneyLsjz(text: string, code: string): FundQuote {
  const payload = JSON.parse(text) as EastmoneyLsjzPayload;
  const first = payload.Data?.LSJZList?.[0];

  if (!first?.JZZZL || !first.FSRQ) {
    throw new Error("missing historical net value");
  }

  const changePercent = Number(first.JZZZL);
  if (!Number.isFinite(changePercent)) {
    throw new Error(`invalid JZZZL: ${first.JZZZL}`);
  }

  return {
    code,
    changePercent,
    dataTime: first.FSRQ,
    source: "eastmoney-lsjz"
  };
}
