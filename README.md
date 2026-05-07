# Fund Reminder

Local reminder tool for an Alipay fixed-investment fund pool.

It only sends reminders. It does not log in to Alipay, scrape account credentials, or place orders.

## First Version

- Reads the active 8-fund pool from `config/funds.json`.
- Uses single-day decline tiers from `config/rules.json`.
- Prints one aggregated reminder with `--dry-run`.
- Can send one aggregated message through the existing local `cc-connect` Feishu channel.

## Commands

```powershell
npm install
npm test
npm run check
npm run start -- --dry-run
```

## Feishu Send

Configure `config/rules.json` with the local `cc-connect.exe` path, project, and session before sending without `--dry-run`.
