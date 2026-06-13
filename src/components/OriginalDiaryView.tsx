import type { DiaryEntry } from "../types/diary";
import { formatReceiptDate, formatWrittenAt } from "../lib/date";
import { ReceiptShell } from "./ReceiptShell";

type OriginalDiaryViewProps = {
  entry: DiaryEntry;
  onBack: () => void;
};

export function OriginalDiaryView({ entry, onBack }: OriginalDiaryViewProps) {
  return (
    <ReceiptShell ariaLabel="원문 일기">
      <header className="receipt-header">
        <div className="receipt-nav">
          <button className="icon-button" type="button" onClick={onBack} aria-label="영수증으로">
            ‹
          </button>
          <p>{formatReceiptDate(entry.date)}</p>
          <span />
        </div>
        <h1>ORIGINAL DIARY</h1>
      </header>

      <div className="dash-line" />

      <p className="original-written">WRITTEN AT {formatWrittenAt(entry.createdAt)}</p>
      <div className="original-body">{entry.body}</div>

      <div className="dash-line" />

      <button className="secondary-action" type="button" onClick={onBack}>
        영수증으로 돌아가기
      </button>
    </ReceiptShell>
  );
}
