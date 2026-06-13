import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

const diaryBody =
  "아침에는 마음이 조금 무거웠다. 그래도 산책을 하며 생각을 정리했다. 밤에는 나를 덜 몰아붙이고 싶었다.";

describe("Receipt Diary app flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a receipt and opens the original diary", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("오늘의 기록"), {
      target: { value: diaryBody },
    });
    fireEvent.click(screen.getByRole("button", { name: "영수증으로 남기기" }));

    const receipt = screen.getByLabelText("일기 해석 영수증");
    expect(within(receipt).getByText("DIARY RECEIPT")).toBeInTheDocument();
    expect(within(receipt).getAllByText(/제가 보기에는/).length).toBeGreaterThan(0);
    expect(within(receipt).getByText("THANK YOU FOR YOUR LIFE.")).toBeInTheDocument();

    fireEvent.click(within(receipt).getByRole("button", { name: "원문 보기" }));

    const original = screen.getByLabelText("원문 일기");
    expect(within(original).getByText("ORIGINAL DIARY")).toBeInTheDocument();
    expect(within(original).getByText(diaryBody)).toBeInTheDocument();
  });

  it("loads saved receipts into the archive after remount", () => {
    const firstRender = render(<App />);

    fireEvent.change(screen.getByLabelText("오늘의 기록"), {
      target: { value: diaryBody },
    });
    fireEvent.click(screen.getByRole("button", { name: "영수증으로 남기기" }));
    firstRender.unmount();

    render(<App />);

    expect(screen.getByLabelText("저장된 일기 영수증 목록")).toBeInTheDocument();
    expect(screen.getByText("NO. 0001")).toBeInTheDocument();
    expect(screen.getByText(/제가 보기에는/)).toBeInTheDocument();
  });
});
