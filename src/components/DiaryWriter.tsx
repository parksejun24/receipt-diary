import { FormEvent, useState } from "react";
import { toDateInputValue } from "../lib/date";
import type { NewDiaryInput } from "../types/diary";
import { ReceiptShell } from "./ReceiptShell";

type DiaryWriterProps = {
  onCreateDiary: (input: NewDiaryInput) => void;
  onOpenArchive: () => void;
};

export function DiaryWriter({ onCreateDiary, onOpenArchive }: DiaryWriterProps) {
  const [body, setBody] = useState("");
  const [date, setDate] = useState(toDateInputValue());
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedBody = body.trim();

    if (trimmedBody.length < 20) {
      setMessage("조금만 더 남겨주세요. 숨은 결을 찾으려면 몇 문장이 더 필요해요.");
      return;
    }

    onCreateDiary({ body: trimmedBody, date });
    setBody("");
    setMessage("");
  }

  return (
    <ReceiptShell ariaLabel="일기 작성 영수증">
      <form className="diary-writer" onSubmit={handleSubmit}>
        <header className="receipt-header">
          <div className="receipt-nav">
            <span aria-hidden="true" />
            <p>{date.replaceAll("-", ".").slice(2)}</p>
            <button className="icon-button" type="button" onClick={onOpenArchive} aria-label="보관함">
              ≡
            </button>
          </div>
          <h1>DIARY RECEIPT</h1>
        </header>

        <div className="dash-line" />

        <label className="field-label" htmlFor="diary-date">
          날짜
        </label>
        <input
          id="diary-date"
          className="date-input"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <label className="field-label" htmlFor="diary-body">
          오늘의 기록
        </label>
        <textarea
          id="diary-body"
          className="diary-textarea"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="오늘 지나간 장면을 편하게 적어주세요."
        />

        {message && <p className="form-message">{message}</p>}

        <div className="dash-line" />

        <button className="primary-action" type="submit">
          영수증으로 남기기
        </button>

        <footer className="receipt-footer">
          <p>THANK YOU FOR YOUR LIFE.</p>
        </footer>
      </form>
    </ReceiptShell>
  );
}
