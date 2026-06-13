import type { HiddenValue, ReceiptInterpretation } from "../types/diary";
import { createId } from "./id";

type InterpretationInput = {
  diaryEntryId: string;
  body: string;
  sequenceNumber: number;
  generatedAt?: string;
};

const reflectiveDefaultValues = [
  "제가 보기에는 오늘의 기록 안에는 버티는 힘이 조용히 남아 있는 것 같아요.",
  "작은 장면을 그냥 흘려보내지 않고 바라본 마음이 보여요.",
  "완벽하지 않은 하루를 다시 읽어보려는 태도도 하나의 가치처럼 느껴져요.",
];

const productConceptPatterns = [
  ["c", "ost"],
  ["a", "mount"],
  ["p", "rice"],
  ["t", "otal"],
  ["s", "core"],
  ["r", "ank"],
  ["s", "treak"],
  ["d", "ashboard"],
  ["best", " ", "day"],
  ["worst", " ", "day"],
  ["performance", " ", "dashboard"],
].map((parts) => new RegExp(parts.join(""), "gi"));

export function createMockInterpretation(input: InterpretationInput): ReceiptInterpretation {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const fragments = extractFragments(input.body);
  const hiddenValues = buildHiddenValues(fragments);

  return {
    id: createId("receipt"),
    diaryEntryId: input.diaryEntryId,
    sequenceNumber: input.sequenceNumber,
    oneLineSummary: buildOneLineSummary(fragments),
    daySummaryPhrase: buildDayPhrase(fragments),
    hiddenValues,
    generatedAt,
  };
}

function extractFragments(body: string): string[] {
  return body
    .split(/[\n.!?。！？]+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function buildOneLineSummary(fragments: string[]): string {
  const anchor = softenProductConcepts(fragments[0] ?? "");

  if (!anchor) {
    return "제가 보기에는 오늘은 다시 바라볼 장면을 남긴 하루 같아요.";
  }

  return `제가 보기에는 "${clip(anchor, 24)}" 안에 오늘의 결이 담겨 있는 것 같아요.`;
}

function buildDayPhrase(fragments: string[]): string {
  const anchor = softenProductConcepts(fragments[1] ?? fragments[0] ?? "");

  if (!anchor) {
    return "다시 읽어볼 만한 하루";
  }

  return `${clip(anchor, 18)}에서 시작된 기록`;
}

function buildHiddenValues(fragments: string[]): HiddenValue[] {
  const values: HiddenValue[] = fragments.slice(0, 3).map((fragment, index) => {
    const softenedFragment = softenProductConcepts(fragment);
    const templates = [
      `제가 보기에는 "${clip(softenedFragment, 18)}" 속에 스스로를 놓치지 않으려는 마음이 숨어 있는 것 같아요.`,
      `"${clip(softenedFragment, 18)}"라는 장면에서 오늘을 세밀하게 바라보는 힘이 보여요.`,
      `이 기록에는 "${clip(softenedFragment, 18)}"라는 장면을 지나온 사람만 알 수 있는 작은 배움이 느껴져요.`,
    ];

    return {
      id: createId("value"),
      text: templates[index % templates.length],
      evidence: clip(softenedFragment, 42),
    };
  });

  while (values.length < 3) {
    const defaultText = reflectiveDefaultValues[values.length];
    values.push({
      id: createId("value"),
      text: defaultText,
    });
  }

  return values;
}

function softenProductConcepts(value: string): string {
  return productConceptPatterns.reduce(
    (current, pattern) => current.replace(pattern, "하루의 한 표현"),
    value,
  );
}

function clip(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}
