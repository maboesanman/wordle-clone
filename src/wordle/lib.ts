import { WordleHint } from "../lib";
import { GameState, LetterData, RowData, RowDataLazy } from "./wordle-types";

export const splitRow: (
  row: RowData,
) => LetterData[] = (row) => {
  const lazy = row.lazy;
  const letters: LetterData[] = [];

  let hints: WordleHint[];
  let entered: boolean;

  if(lazy && row.entered) {
    hints = lazy.lib.evaluateGuess(lazy.word, row.guess);
    entered = true;
  } else {
    hints = [];
    entered = false;
  }

  for(let i = 0; i < row.length; i++) {
    letters.push({
      entered,
      character: row.guess[i],
      hint: hints[i],
    });
  }

  return letters;
}

export const getAggregateHints: (
  rows: RowData[],
) => Record<string, WordleHint> = (rows) => {
  const hints: Record<string, WordleHint> = {};

  for ( const row of rows) {
    if(row.lazy === undefined) {
      return {};
    }
    if(row.entered) {
      const rowHints = row.lazy.lib.evaluateGuess(row.lazy.word, row.guess);
      for(let i = 0; i < row.guess.length; i++) {
        const prev = hints[row.guess[i]] ?? -1 as number;
        const next = rowHints[i] ?? 0 as number;
        if(prev < next) {
          hints[row.guess[i]] = rowHints[i];
        }
      }
    }
  }
  
  return hints;
}

export const wordleRows = (gameState: GameState) => {
  const result: RowData[] = [];

  const lazy: RowDataLazy | undefined = gameState.lazyState ? {
    word: gameState.lazyState.word,
    lib: gameState.lazyState.lib,
  } : undefined;
  for (let i = 0; i < gameState.rows; i++) {
    result.push({
      length: gameState.length,
      guess: gameState.guesses[i] ?? "",
      entered: (gameState.guesses.length - 1 > i),
      lazy,
    })
  }
  return result
}
