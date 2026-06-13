export type DiaryEntry = {
  id: string;
  date: string;
  body: string;
  receipt: ReceiptInterpretation;
  createdAt: string;
  updatedAt: string;
};

export type ReceiptInterpretation = {
  id: string;
  diaryEntryId: string;
  sequenceNumber: number;
  oneLineSummary: string;
  daySummaryPhrase: string;
  hiddenValues: HiddenValue[];
  generatedAt: string;
};

export type HiddenValue = {
  id: string;
  text: string;
  evidence?: string;
};

export type NewDiaryInput = {
  body: string;
  date?: string;
};
