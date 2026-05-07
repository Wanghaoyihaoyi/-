# 基金提醒器 / Fund Reminder

## 中文

这是一个本地基金提醒工具，用于支付宝定投基金池的辅助观察。

它只发送提醒，不登录支付宝，不抓取账号密码，也不自动买入或卖出。

### 第一版能力

- 从 `config/funds.json` 读取 8 支进行中的定投基金。
- 从 `config/rules.json` 读取单日跌幅分档规则。
- 使用 `--dry-run` 打印一条聚合提醒。
- 可通过本机已有 `cc-connect` 飞书通道发送一条手机提醒。

### 交易时间判断

场外基金不是“点击后马上可见份额”的交易方式。一般规则是：

- 交易日 15:00 前提交申购，通常按当天申请处理，并按当天净值成交。
- 交易日 15:00 后提交申购，通常顺延为下一交易日申请。
- 普通基金通常 T+1 确认份额。
- 本项目里的基金大多是 QDII，QDII 多数 T+2 确认份额，部分产品可能按基金合同或销售页面提示调整。

因此，本工具的提醒含义是“可以考虑在交易截止前提交加仓申请”，不是“当天立刻买入并显示份额”。

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

### Trading-Time Judgment

OTC fund subscriptions do not usually show confirmed shares immediately after clicking buy. The common rules are:

- If a subscription is submitted before 15:00 on a trading day, it is usually treated as that trading day's application and priced with that day's NAV.
- If submitted after 15:00 on a trading day, it is usually treated as the next trading day's application.
- Ordinary funds are usually confirmed on T+1.
- Most funds in this project are QDII funds. QDII funds are commonly confirmed on T+2, although the final rule depends on each fund contract and the sales page notice.

So this tool means "consider submitting an extra-buy application before the trading cutoff", not "the fund is bought and visible immediately on the same day".

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
