# 基金提醒器 / Fund Reminder

## 中文

这是一个本地基金提醒工具，用于支付宝定投基金池的辅助观察。

它只发送提醒，不登录支付宝，不抓取账号密码，也不自动买入或卖出。

### 第一版能力

- 从 `config/funds.json` 读取 8 支进行中的定投基金。
- 从 `config/rules.json` 读取单日跌幅分档规则。
- 使用 `--dry-run` 打印一条聚合提醒。
- 可通过本机已有 `cc-connect` 飞书通道发送一条手机提醒。
- 默认按“定投增强”理解：支付宝自动定投是基础仓位，本工具只计算额外加仓建议。

### 交易时间判断

场外基金不是“点击后马上可见份额”的交易方式。一般规则是：

- 交易日 15:00 前提交申购，通常按当天申请处理，并按当天净值成交。
- 交易日 15:00 后提交申购，通常顺延为下一交易日申请。
- 普通基金通常 T+1 确认份额。
- 本项目里的基金大多是 QDII，QDII 多数 T+2 确认份额，部分产品可能按基金合同或销售页面提示调整。

因此，本工具的提醒含义是“可以考虑在交易截止前提交加仓申请”，不是“当天立刻买入并显示份额”。

### 针对自动定投用户的优化空间

- 提醒时间应尽量放在交易日 14:30-14:50，给手动确认留时间。
- `-2%` 档位适合轻提醒，`-4%` 和 `-6%` 才适合强提醒。
- 日定投基金已经高频买入，额外加仓应更克制；周定投基金可以更关注大跌日。
- 后续可以增加“周/月额外加仓上限”，避免连续下跌时提醒金额过大。
- 后续可以增加“已定投扣款日识别”，如果当天本来就会扣款，则降低额外加仓优先级。

### 命令

```powershell
npm install
npm test
npm run check
npm run start -- --dry-run
```

### 飞书发送

真实飞书 session key 不要提交到 Git。复制 `config/rules.json` 为 `config/rules.local.json`，再填入本机 `cc-connect.exe` 路径、data dir、project 和 session。

```powershell
npm run start -- --send --rules config/rules.local.json
```

### 文档维护规则

以后更新 README 时，必须同时维护中文和英文两版内容。

## English

This is a local reminder tool for an Alipay fixed-investment fund pool.

It only sends reminders. It does not log in to Alipay, scrape account credentials, or place buy or sell orders.

### First Version

- Reads the active 8-fund pool from `config/funds.json`.
- Reads single-day decline tiers from `config/rules.json`.
- Prints one aggregated reminder with `--dry-run`.
- Can send one mobile reminder through the existing local `cc-connect` Feishu channel.
- Defaults to an "auto-invest enhancement" interpretation: Alipay auto-investment is the base position, and this tool only calculates extra-buy suggestions.

### Trading-Time Judgment

OTC fund subscriptions do not usually show confirmed shares immediately after clicking buy. The common rules are:

- If a subscription is submitted before 15:00 on a trading day, it is usually treated as that trading day's application and priced with that day's NAV.
- If submitted after 15:00 on a trading day, it is usually treated as the next trading day's application.
- Ordinary funds are usually confirmed on T+1.
- Most funds in this project are QDII funds. QDII funds are commonly confirmed on T+2, although the final rule depends on each fund contract and the sales page notice.

So this tool means "consider submitting an extra-buy application before the trading cutoff", not "the fund is bought and visible immediately on the same day".

### Optimization For Auto-Invest Users

- Run reminders around 14:30-14:50 on trading days so there is still time for manual confirmation.
- Treat the `-2%` tier as a light reminder. The `-4%` and `-6%` tiers are better candidates for stronger reminders.
- Daily auto-invest funds already buy frequently, so extra-buy suggestions should be conservative. Weekly auto-invest funds deserve more attention on sharp down days.
- A future version can add weekly or monthly extra-buy caps to avoid excessive suggestions during continuous declines.
- A future version can detect scheduled auto-invest days and lower the priority when the fund is already going to deduct money that day.

### Commands

```powershell
npm install
npm test
npm run check
npm run start -- --dry-run
```

### Feishu Send

Keep the real Feishu session key out of Git. Create `config/rules.local.json` from `config/rules.json`, then fill in the local `cc-connect.exe` path, data dir, project, and session.

```powershell
npm run start -- --send --rules config/rules.local.json
```

### Documentation Rule

Future README updates must keep both Chinese and English versions in sync.
