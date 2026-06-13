import { beforeEach, describe, expect, it } from "vitest";
import { DIARY_STORAGE_KEY, loadDiaryEntries, prependDiaryEntry } from "./storage";
import type { DiaryEntry } from "../types/diary";

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

function createEntry(id: string, createdAt: string): DiaryEntry {
  return {
    id,
    date: "2026-06-14",
    body: "오늘은 기록을 남겼다. 다시 읽어볼 장면이 있었다.",
    createdAt,
    updatedAt: createdAt,
    receipt: {
      id: `receipt-${id}`,
      diaryEntryId: id,
      sequenceNumber: 1,
      oneLineSummary: "제가 보기에는 오늘의 결이 남아 있는 것 같아요.",
      daySummaryPhrase: "다시 읽어볼 만한 하루",
      hiddenValues: [],
      generatedAt: createdAt,
    },
  };
}

describe("diary storage", () => {
  let storage: ReturnType<typeof createMemoryStorage>;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("returns an empty list when storage is empty", () => {
    expect(loadDiaryEntries(storage)).toEqual([]);
  });

  it("returns an empty list for malformed data", () => {
    storage.setItem(DIARY_STORAGE_KEY, "{bad");

    expect(loadDiaryEntries(storage)).toEqual([]);
  });

  it("prepends and persists diary entries", () => {
    const first = createEntry("first", "2026-06-14T01:00:00.000Z");
    const second = createEntry("second", "2026-06-14T02:00:00.000Z");

    prependDiaryEntry(first, storage);
    prependDiaryEntry(second, storage);

    expect(loadDiaryEntries(storage).map((entry) => entry.id)).toEqual(["second", "first"]);
  });
});
