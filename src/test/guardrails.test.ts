import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const blockedWords = [
  "cost",
  "amount",
  "price",
  "total",
  "score",
  "rank",
  "streak",
  "performance dashboard",
];

const sourceRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/test$/, "");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      return sourceFiles(path);
    }

    if (!/\.(ts|tsx|css)$/.test(path) || path.endsWith(".test.ts")) {
      return [];
    }

    return [path];
  });
}

describe("product language guardrails", () => {
  it("keeps app source away from blocked finance and performance concepts", () => {
    const offenders = sourceFiles(sourceRoot).flatMap((path) => {
      const content = readFileSync(path, "utf8").toLowerCase();

      return blockedWords
        .filter((word) => content.includes(word))
        .map((word) => `${path}: ${word}`);
    });

    expect(offenders).toEqual([]);
  });
});
