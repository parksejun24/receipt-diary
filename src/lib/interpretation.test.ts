import { describe, expect, it } from "vitest";
import { createMockInterpretation } from "./interpretation";

const blockedWords = [
  "cost",
  "amount",
  "price",
  "total",
  "score",
  "rank",
  "best day",
  "worst day",
  "streak",
  "performance dashboard",
];

describe("mock interpretation", () => {
  it("creates the required receipt interpretation shape", () => {
    const interpretation = createMockInterpretation({
      diaryEntryId: "diary-1",
      body: "아침에는 마음이 조금 무거웠다. 그래도 산책을 하며 생각을 정리했다. 밤에는 나를 덜 몰아붙이고 싶었다.",
      sequenceNumber: 1,
      generatedAt: "2026-06-14T00:00:00.000Z",
    });

    expect(interpretation.oneLineSummary).toContain("제가 보기에는");
    expect(interpretation.daySummaryPhrase.length).toBeGreaterThan(0);
    expect(interpretation.hiddenValues).toHaveLength(3);
    expect(interpretation.hiddenValues[0].evidence).toBeTruthy();
  });

  it("keeps generated interpretation away from blocked product concepts", () => {
    const interpretation = createMockInterpretation({
      diaryEntryId: "diary-1",
      body: [
        "I wrote cost amount price total score rank best day worst day streak performance dashboard in my diary.",
        "오늘은 긴 하루였다.",
        "작은 장면을 다시 바라보고 싶다.",
      ].join(" "),
      sequenceNumber: 1,
      generatedAt: "2026-06-14T00:00:00.000Z",
    });
    const serialized = JSON.stringify(interpretation).toLowerCase();

    for (const word of blockedWords) {
      expect(serialized).not.toContain(word);
    }
  });
});
