import { LetterData, RowData } from "./wordle-types";
import { evaluateGuess, WordleHint } from "./../lib";

export const splitRowSkipHint: (
  row: RowData,
) => LetterData[] = (row) => {
  const letters: LetterData[] = [];
  for(let i = 0; i < row.length; i++) {
    letters.push({
      entered: false,
      character: row.guess[i],
    });
  }

  return letters;
}

export const splitRow: (
  row: RowData,
) => Promise<LetterData[]> = async (row) => {
  if(!row.entered) {
    return splitRowSkipHint(row);
  }
  const hints = await evaluateGuess(await row.word, row.guess);
  const letters: LetterData[] = [];
  for(let i = 0; i < row.length; i++) {
    letters.push({
      entered: true,
      character: row.guess[i],
      hint: hints[i],
    });
  }

  return letters;
}

export const getAggregateHints: (
  rows: RowData[],
) => Promise<Record<string, WordleHint>> = async (rows) => {
  const hints: Record<string, WordleHint> = {};

  for ( const row of rows) {
    if(row.entered) {
      const rowHints = await evaluateGuess(await row.word, row.guess);
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
