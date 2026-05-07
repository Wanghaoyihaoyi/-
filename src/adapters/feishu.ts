import { spawn } from "node:child_process";
import type { FeishuConfig } from "../core/types.js";

export async function sendFeishuMessage(config: FeishuConfig, message: string): Promise<void> {
  const args = ["send", "--stdin"];

  if (config.dataDir) {
    args.push("--data-dir", config.dataDir);
  }

  if (config.project) {
    args.push("--project", config.project);
  }

  if (config.session) {
    args.push("--session", config.session);
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn(config.ccConnectPath, args, {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });

    let stderr = "";

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`cc-connect send failed with code ${code}: ${stderr.trim()}`));
    });

    child.stdin.end(message);
  });
}
