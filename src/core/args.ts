export interface CliOptions {
  shouldSend: boolean;
  fundsPath: string;
  rulesPath: string;
}

export function parseCliArgs(args: string[]): CliOptions {
  let fundsPath = "config/funds.json";
  let rulesPath = "config/rules.json";
  const hasSend = args.includes("--send");
  const hasDryRun = args.includes("--dry-run");

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--funds") {
      fundsPath = requireValue(args, index, "--funds");
      index += 1;
    }

    if (arg === "--rules") {
      rulesPath = requireValue(args, index, "--rules");
      index += 1;
    }
  }

  return {
    shouldSend: hasSend && !hasDryRun,
    fundsPath,
    rulesPath
  };
}

function requireValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }

  return value;
}
