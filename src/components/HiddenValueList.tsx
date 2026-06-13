import type { HiddenValue } from "../types/diary";

type HiddenValueListProps = {
  values: HiddenValue[];
};

export function HiddenValueList({ values }: HiddenValueListProps) {
  return (
    <section className="hidden-values" aria-label="오늘의 숨어있는 가치">
      <h2>HIDDEN VALUE</h2>
      <ul>
        {values.map((value) => (
          <li key={value.id}>
            <p>{value.text}</p>
            {value.evidence && <small>from: {value.evidence}</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}
