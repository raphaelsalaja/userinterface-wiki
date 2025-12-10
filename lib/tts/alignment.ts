import { normalizeWord } from "@/lib/text/normalize-word";

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

export type NumericSeries = Array<number | string | null | undefined>;

export interface ElevenLabsAlignment {
  words?: string[];
  word_start_times_seconds?: NumericSeries;
  word_end_times_seconds?: NumericSeries;
  word_start_times_ms?: NumericSeries;
  word_end_times_ms?: NumericSeries;
  word_start_times?: NumericSeries;
  word_end_times?: NumericSeries;
  characters?: string[];
  character_start_times_seconds?: NumericSeries;
  character_end_times_seconds?: NumericSeries;
  character_start_times_ms?: NumericSeries;
  character_end_times_ms?: NumericSeries;
  char_start_times_seconds?: NumericSeries;
  char_end_times_seconds?: NumericSeries;
  char_start_times_ms?: NumericSeries;
  char_end_times_ms?: NumericSeries;
}

interface CharacterEntry {
  character: string;
  start: number | null;
  end: number | null;
}

export function buildWordTimestamps(
  alignment?: ElevenLabsAlignment,
): WordTimestamp[] {
  if (!alignment) return [];

  const fromWords = buildFromWordSeries(alignment);
  if (fromWords.length) {
    return fromWords;
  }

  const fromCharacters = buildFromCharacterSeries(alignment);
  if (fromCharacters.length) {
    return fromCharacters;
  }

  return [];
}

function buildFromWordSeries(alignment: ElevenLabsAlignment): WordTimestamp[] {
  if (!alignment.words?.length) return [];

  const startSeries =
    alignment.word_start_times_seconds ??
    alignment.word_start_times_ms ??
    alignment.word_start_times ??
    [];
  const endSeries =
    alignment.word_end_times_seconds ??
    alignment.word_end_times_ms ??
    alignment.word_end_times ??
    [];

  return alignment.words
    .map((word, index) => {
      const start = normalizeTimestampValue(startSeries[index]);
      const end = normalizeTimestampValue(
        endSeries[index] ?? startSeries[index],
      );
      const normalized = normalizeWord(word ?? "");
      if (!word || !normalized || start === null || end === null) {
        return null;
      }
      return {
        word,
        start,
        end,
        normalized,
      } satisfies WordTimestamp;
    })
    .filter(Boolean) as WordTimestamp[];
}

function buildFromCharacterSeries(
  alignment: ElevenLabsAlignment,
): WordTimestamp[] {
  if (!alignment.characters?.length) return [];

  const startSeries =
    alignment.character_start_times_seconds ??
    alignment.char_start_times_seconds ??
    alignment.character_start_times_ms ??
    alignment.char_start_times_ms ??
    [];
  const endSeries =
    alignment.character_end_times_seconds ??
    alignment.char_end_times_seconds ??
    alignment.character_end_times_ms ??
    alignment.char_end_times_ms ??
    [];

  const entries: CharacterEntry[] = alignment.characters.map(
    (character, index) => ({
      character,
      start: normalizeTimestampValue(startSeries[index]),
      end: normalizeTimestampValue(endSeries[index] ?? startSeries[index]),
    }),
  );

  const results: WordTimestamp[] = [];
  let buffer = "";
  let startTime: number | null = null;
  let lastCharacterEnd: number | null = null;

  for (const entry of entries) {
    const { character, start, end } = entry;
    const isWhitespace = !character || !character.trim();

    if (!isWhitespace) {
      buffer += character;
      if (startTime === null && typeof start === "number") {
        startTime = start;
      }
      if (typeof end === "number") {
        lastCharacterEnd = end;
      }
    }

    if (isWhitespace) {
      if (buffer.trim() && startTime !== null) {
        const normalized = normalizeWord(buffer);
        if (normalized) {
          results.push({
            word: buffer,
            start: startTime,
            end: lastCharacterEnd ?? startTime,
            normalized,
          });
        }
      }
      buffer = "";
      startTime = null;
      lastCharacterEnd = null;
    }
  }

  if (buffer.trim() && startTime !== null) {
    const normalized = normalizeWord(buffer);
    if (normalized) {
      results.push({
        word: buffer,
        start: startTime,
        end: lastCharacterEnd ?? startTime,
        normalized,
      });
    }
  }

  return results;
}

function normalizeTimestampValue(value?: number | string | null) {
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    value = Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value > 1000) {
    return value / 1000;
  }

  return value;
}
