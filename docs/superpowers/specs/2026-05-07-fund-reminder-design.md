# Fund Reminder Design

## Goal

Build a local reminder tool for the user's Alipay fixed-investment fund pool.

The tool only reminds. It must not log in to Alipay, scrape account credentials, or place orders.

## Fund Pool

Only active fixed-investment assets from the provided screenshots are included. Paused assets are excluded.

| Code | Name | Current Plan | Base Amount |
| --- | --- | --- | ---: |
| 018043 | 天弘纳斯达克100指数(QDII)A | Daily | 40 |
| 006479 | 广发纳斯达克100ETF联接(QDII)C | Daily | 10 |
| 008763 | 天弘越南市场股票(QDII)A | Weekly | 40 |
| 270042 | 广发纳斯达克100ETF联接(QDII)A | Daily | 50 |
| 016452 | 南方纳斯达克100指数(QDII)A | Weekly | 50 |
| 017730 | 嘉实全球产业升级股票(QDII)A | Daily | 28 |
| 016664 | 天弘全球高端制造混合(QDII)A | Daily | 28 |
| 012920 | 易方达全球成长精选混合(QDII)A | Daily | 28 |

The code list must be treated as a draft until verified against the user's Alipay fund detail pages or another trusted fund data source.

## Reminder Rule

Use single-day decline as the first version trigger.

Because the user already has automatic fixed investments, the reminder is an extra-buy suggestion. It must not imply that the normal fixed investment should be replaced.

| Decline | Suggested Extra Buy |
| ---: | ---: |
| <= -2% | 1x base amount |
| <= -4% | 2x base amount |
| <= -6% | 3x base amount |

If multiple thresholds match, use the deepest matched tier.

## Delivery

Send reminders through Feishu using the existing local `cc-connect` setup.

The message must be aggregated by run. Do not send one message per fund unless debugging.

Message sections:

- Triggered funds
- Near-trigger funds
- Data errors
- Total suggested amount

## Data Notes

Most assets are QDII funds. Net value and estimated value may lag and may not match the final Alipay transaction price.

The first implementation should expose the data timestamp in each reminder so the user can judge staleness.

## Trading-Time Notes

The reminder must show transaction timing clearly:

- Before the 15:00 trading-day cutoff: the user can consider submitting an extra-buy application before the cutoff.
- After the 15:00 cutoff: a new application usually rolls to the next trading day.
- On weekends: a new application usually rolls to the next trading day.
- Ordinary funds are usually T+1 confirmation; QDII funds are commonly T+2 confirmation.

This tool should phrase suggestions as "extra-buy application" or "extra-buy suggestion", not "same-day confirmed buy".

## First Version Scope

1. JSON fund pool.
2. JSON rule config.
3. Manual command to run one check.
4. Feishu aggregated reminder.
5. No local web UI yet.
6. No automatic buy.

## Verification

Success criteria for the first version:

1. The command reads all 8 funds.
2. It fetches usable latest data or reports a clear data error per fund.
3. It calculates the matched tier correctly for test inputs.
4. It sends one Feishu message containing the aggregated result.

## Source Checks Used For Draft Codes

- 天弘纳斯达克100指数(QDII)A: CNINFO annual report shows main code `018043` and A code `018043`.
- 天弘越南市场股票(QDII)A: CNINFO annual report shows main code `008763` and A code `008763`.
- 广发纳斯达克100ETF联接(QDII)A/C: 广发基金公告 shows RMB A `270042`, RMB C `006479`.
- 南方纳斯达克100指数(QDII)A: 南方基金 report shows A code `016452`.
- 嘉实全球产业升级股票(QDII)A: 嘉实基金 product summary shows A code `017730`.
- 天弘全球高端制造混合(QDII)A: CNINFO quarterly report shows A code `016664`.
- 易方达全球成长精选混合(QDII)A: 易方达/CNINFO announcement shows main code `012920`.
