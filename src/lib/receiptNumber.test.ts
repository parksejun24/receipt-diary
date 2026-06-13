import { describe, expect, it } from "vitest";
import { formatSequenceNumber, getNextSequenceNumber } from "./receiptNumber";
import type { DiaryEntry } from "../types/diary";

describe("receipt metadata numbering", () => {
  it("starts at one", () => {
    expect(getNextSequenceNumber([])).toBe(1);
  });

  it("increments from saved entries", () => {
    expect(getNextSequenceNumber([{} as DiaryEntry, {} as DiaryEntry])).toBe(3);
  });

  it("formats as a quiet metadata code", () => {
    expect(formatSequenceNumber(7)).toBe("0007");
  });
});
