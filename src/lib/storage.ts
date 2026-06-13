import type { DiaryEntry } from "../types/diary";

export const DIARY_STORAGE_KEY = "receipt-diary.entries.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DiaryEntry>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.body === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    typeof candidate.receipt === "object" &&
    candidate.receipt !== null
  );
}

export function loadDiaryEntries(storage: StorageLike = localStorage): DiaryEntry[] {
  const raw = storage.getItem(DIARY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isDiaryEntry).sort((first, second) => {
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  } catch {
    return [];
  }
}

export function saveDiaryEntries(
  entries: DiaryEntry[],
  storage: StorageLike = localStorage,
): void {
  storage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
}

export function prependDiaryEntry(
  entry: DiaryEntry,
  storage: StorageLike = localStorage,
): DiaryEntry[] {
  const entries = loadDiaryEntries(storage);
  const nextEntries = [entry, ...entries];
  saveDiaryEntries(nextEntries, storage);

  return nextEntries;
}
