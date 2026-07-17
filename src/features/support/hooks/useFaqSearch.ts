import { useMemo } from "react";
import type { FaqItem } from "../types";
import { FAQ_ITEMS } from "../constants/faqContent";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function scoreMatch(query: string, item: FaqItem): number {
  const q = normalize(query);
  if (!q) return 1;

  const question = normalize(item.question);
  const answer = normalize(item.answer);
  const laneText = item.laneAnswers
    ? normalize(
        [item.laneAnswers.direct, item.laneAnswers.wholesale].filter(Boolean).join(" ")
      )
    : "";

  if (question.includes(q)) return 100;
  if (answer.includes(q)) return 80;
  if (laneText.includes(q)) return 70;

  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length === 0) return 0;

  const haystack = `${question} ${answer} ${laneText}`;
  const matched = tokens.filter((t) => haystack.includes(t)).length;
  return matched > 0 ? (matched / tokens.length) * 50 : 0;
}

export function useFaqSearch(query: string, items: FaqItem[] = FAQ_ITEMS) {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return items;

    return items
      .map((item) => ({ item, score: scoreMatch(trimmed, item) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [query, items]);
}
