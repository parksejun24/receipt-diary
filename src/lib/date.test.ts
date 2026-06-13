import { describe, expect, it } from "vitest";
import { formatReceiptDate, formatReceiptTime, toDateInputValue } from "./date";

describe("date helpers", () => {
  it("formats a date for receipt metadata", () => {
    expect(formatReceiptDate("2026-06-14")).toBe("26.06.14");
  });

  it("formats a time for receipt metadata", () => {
    expect(formatReceiptTime("2026-06-14T09:05:00+09:00")).toBe("09:05");
  });

  it("creates date input values", () => {
    expect(toDateInputValue(new Date("2026-06-14T00:00:00+09:00"))).toBe("2026-06-14");
  });
});
