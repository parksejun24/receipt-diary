import type { DiaryEntry } from "../types/diary";
import { formatReceiptDate, formatWrittenAt } from "../lib/date";
import { formatSequenceNumber } from "../lib/receiptNumber";
import { HiddenValueList } from "./HiddenValueList";
import { ReceiptShell } from "./ReceiptShell";

type ReceiptDetailProps = {
  entry: DiaryEntry;
  onOpenArchive: () => void;
  onOpenOriginal: () => void;
  onCreateNew: () => void;
};

export function ReceiptDetail({
  entry,
  onOpenArchive,
  onOpenOriginal,
  onCreateNew,
}: ReceiptDetailProps) {
  return (
    <ReceiptShell ariaLabel="일기 해석 영수증">
      <header className="receipt-header">
        <div className="receipt-nav">
          <button className="icon-button" type="button" onClick={onOpenArchive} aria-label="보관함으로">
            ‹
          </button>
          <p>{formatReceiptDate(entry.date)}</p>
          <button className="icon-button" type="button" onClick={onCreateNew} aria-label="새 기록">
            +
          </button>
        </div>
        <h1>DIARY RECEIPT</h1>
      </header>

      <div className="dash-line" />

      <dl className="receipt-meta">
        <div>
          <dt>NO.</dt>
          <dd>{formatSequenceNumber(entry.receipt.sequenceNumber)}</dd>
        </div>
        <div>
          <dt>WRITTEN</dt>
          <dd>{formatWrittenAt(entry.createdAt)}</dd>
        </div>
      </dl>

      <section className="receipt-summary">
        <p className="summary-label">ONE LINE</p>
        <p>{entry.receipt.oneLineSummary}</p>
      </section>

      <div className="dash-line" />

      <section className="receipt-phrase">
        <p>{entry.receipt.daySummaryPhrase}</p>
      </section>

      <HiddenValueList values={entry.receipt.hiddenValues} />

      <div className="dash-line" />

      <button className="secondary-action" type="button" onClick={onOpenOriginal}>
        원문 보기
      </button>

      <footer className="receipt-footer">
        <p>THANK YOU FOR YOUR LIFE.</p>
      </footer>
    </ReceiptShell>
  );
}
