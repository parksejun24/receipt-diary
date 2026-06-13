import { FormEvent, useState } from "react";
import { toDateInputValue } from "../lib/date";
import type { NewDiaryInput } from "../types/diary";

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
    <form className="diary-writer" onSubmit={handleSubmit}>
      <div className="diary-writer__topline">
        <p className="eyebrow">DIARY RECEIPT</p>
        <button className="text-button" type="button" onClick={onOpenArchive}>
          보관함
        </button>
      </div>

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

      <button className="primary-action" type="submit">
        영수증으로 남기기
      </button>
    </form>
  );
}
