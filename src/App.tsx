import { useMemo, useState } from "react";
import { ArchiveReceipt } from "./components/ArchiveReceipt";
import { DiaryWriter } from "./components/DiaryWriter";
import { OriginalDiaryView } from "./components/OriginalDiaryView";
import { ReceiptDetail } from "./components/ReceiptDetail";
import { createMockInterpretation } from "./lib/interpretation";
import { getNextSequenceNumber } from "./lib/receiptNumber";
import { loadDiaryEntries, prependDiaryEntry } from "./lib/storage";
import { createId } from "./lib/id";
import { toDateInputValue } from "./lib/date";
import type { DiaryEntry, NewDiaryInput } from "./types/diary";

type AppView = "writer" | "archive" | "receipt" | "original";

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadDiaryEntries());
  const [view, setView] = useState<AppView>(entries.length > 0 ? "archive" : "writer");
  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.id ?? null);

  const selectedEntry = useMemo(() => {
    return entries.find((entry) => entry.id === selectedId) ?? entries[0] ?? null;
  }, [entries, selectedId]);

  function handleCreateDiary(input: NewDiaryInput) {
    const now = new Date().toISOString();
    const diaryEntryId = createId("diary");
    const sequenceNumber = getNextSequenceNumber(entries);
    const receipt = createMockInterpretation({
      diaryEntryId,
      body: input.body,
      sequenceNumber,
      generatedAt: now,
    });
    const entry: DiaryEntry = {
      id: diaryEntryId,
      date: input.date ?? toDateInputValue(),
      body: input.body,
      receipt,
      createdAt: now,
      updatedAt: now,
    };
    const nextEntries = prependDiaryEntry(entry);

    setEntries(nextEntries);
    setSelectedId(entry.id);
    setView("receipt");
  }

  function openEntry(entryId: string) {
    setSelectedId(entryId);
    setView("receipt");
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <section className="writer-panel" aria-label="일기 작성">
          <DiaryWriter onCreateDiary={handleCreateDiary} onOpenArchive={() => setView("archive")} />
        </section>

        <section className="receipt-panel" aria-live="polite">
          {view === "writer" && (
            <ArchiveReceipt
              entries={entries}
              selectedId={selectedEntry?.id ?? null}
              onOpenEntry={openEntry}
              onCreateNew={() => setView("writer")}
            />
          )}

          {view === "archive" && (
            <ArchiveReceipt
              entries={entries}
              selectedId={selectedEntry?.id ?? null}
              onOpenEntry={openEntry}
              onCreateNew={() => setView("writer")}
            />
          )}

          {view === "receipt" && selectedEntry && (
            <ReceiptDetail
              entry={selectedEntry}
              onOpenArchive={() => setView("archive")}
              onOpenOriginal={() => setView("original")}
              onCreateNew={() => setView("writer")}
            />
          )}

          {view === "original" && selectedEntry && (
            <OriginalDiaryView entry={selectedEntry} onBack={() => setView("receipt")} />
          )}
        </section>
      </div>
    </main>
  );
}
