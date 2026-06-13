import type { DiaryEntry } from "../types/diary";

export function getNextSequenceNumber(entries: DiaryEntry[]): number {
  return entries.length + 1;
}

export function formatSequenceNumber(sequenceNumber: number): string {
  return String(sequenceNumber).padStart(4, "0");
}
