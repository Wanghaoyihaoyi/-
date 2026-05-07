import { describe, expect, test } from "vitest";
import { parseCliArgs } from "../src/core/args.js";

describe("parseCliArgs", () => {
  test("defaults to dry-run with standard config paths", () => {
    expect(parseCliArgs([])).toEqual({
      shouldSend: false,
      fundsPath: "config/funds.json",
      rulesPath: "config/rules.json"
    });
  });

  test("enables send only with explicit send flag", () => {
    expect(parseCliArgs(["--send"])).toMatchObject({
      shouldSend: true
    });
  });

  test("dry-run wins over send", () => {
    expect(parseCliArgs(["--send", "--dry-run"])).toMatchObject({
      shouldSend: false
    });
  });

  test("accepts custom rules and funds paths", () => {
    expect(parseCliArgs(["--rules", "config/rules.local.json", "--funds", "custom-funds.json"])).toEqual({
      shouldSend: false,
      fundsPath: "custom-funds.json",
      rulesPath: "config/rules.local.json"
    });
  });
});
