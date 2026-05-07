import { describe, expect, test } from "vitest";
import { parseEastmoneyJsonp, parseEastmoneyLsjz } from "../src/adapters/eastmoney.js";

describe("parseEastmoneyJsonp", () => {
  test("parses a valid Eastmoney JSONP quote", () => {
    const result = parseEastmoneyJsonp(
      'jsonpgz({"fundcode":"018043","name":"天弘纳斯达克100指数发起(QDII)A","gszzl":"1.98","gztime":"2026-05-07 04:00"});',
      "018043"
    );

    expect(result).toEqual({
      code: "018043",
      changePercent: 1.98,
      dataTime: "2026-05-07 04:00",
      source: "eastmoney"
    });
  });

  test("rejects responses without usable change percent", () => {
    expect(() =>
      parseEastmoneyJsonp('jsonpgz({"fundcode":"018043","gszzl":"","gztime":"2026-05-07 04:00"});', "018043")
    ).toThrow("missing gszzl");
  });

  test("rejects fund code mismatches", () => {
    expect(() =>
      parseEastmoneyJsonp('jsonpgz({"fundcode":"270042","gszzl":"-2.1","gztime":"2026-05-07 04:00"});', "018043")
    ).toThrow("fund code mismatch");
  });

  test("parses latest historical net value change as fallback", () => {
    const result = parseEastmoneyLsjz(
      '{"Data":{"LSJZList":[{"FSRQ":"2026-04-30","JZZZL":"1.26"},{"FSRQ":"2026-04-29","JZZZL":"1.06"}]},"ErrCode":0}',
      "016664"
    );

    expect(result).toEqual({
      code: "016664",
      changePercent: 1.26,
      dataTime: "2026-04-30",
      source: "eastmoney-lsjz"
    });
  });

  test("rejects historical net value responses without rows", () => {
    expect(() => parseEastmoneyLsjz('{"Data":{"LSJZList":[]},"ErrCode":0}', "016664")).toThrow("missing historical net value");
  });
});
