import type { DiaryEntry } from "../types/diary";
import { formatReceiptDate } from "../lib/date";
import { formatSequenceNumber } from "../lib/receiptNumber";
import { ReceiptShell } from "./ReceiptShell";

type ArchiveReceiptProps = {
  entries: DiaryEntry[];
  selectedId: string | null;
  onOpenEntry: (entryId: string) => void;
  onCreateNew: () => void;
};

export function ArchiveReceipt({
  entries,
  selectedId,
  onOpenEntry,
  onCreateNew,
}: ArchiveReceiptProps) {
  return (
    <ReceiptShell ariaLabel="저장된 일기 영수증 목록">
      <header className="receipt-header">
        <p className="receipt-kicker">ARCHIVE</p>
        <h1>DIARY RECEIPT</h1>
      </header>

      <div className="dash-line" />

      {entries.length === 0 ? (
        <div className="empty-receipt">
          <p>아직 남겨진 기록이 없어요.</p>
          <p>첫 장면을 적으면 이곳에 조용히 보관됩니다.</p>
        </div>
      ) : (
        <ol className="archive-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                className={`archive-row ${entry.id === selectedId ? "archive-row--active" : ""}`}
                type="button"
                onClick={() => onOpenEntry(entry.id)}
              >
                <span>{formatReceiptDate(entry.date)}</span>
                <span>NO. {formatSequenceNumber(entry.receipt.sequenceNumber)}</span>
                <strong>{entry.receipt.oneLineSummary}</strong>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="dash-line" />

      <button className="secondary-action" type="button" onClick={onCreateNew}>
        새 기록 쓰기
      </button>
    </ReceiptShell>
  );
}
