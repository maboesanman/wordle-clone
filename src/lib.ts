const wordleClone = import(/* webpackPreload: true */ "wordle-clone");

export const getRandomWord = async (n: number): Promise<string> => {
  const wordleCloneLib = await wordleClone;
  return wordleCloneLib.get_random_word(n)
}

export const validateWord = async (word: string): Promise<boolean> => {
  const wordleCloneLib = await wordleClone;
  return wordleCloneLib.validate_word(word)
}

export enum WordleHint {
  Correct,
  Misplaced,
  Missing,
}

export const evaluateGuess = async (word: string, guess: string): Promise<WordleHint[]> => {
  const wordleCloneLib = await wordleClone;
  const mask = wordleCloneLib.evaluate_guess(word, guess);
  const hints = [...mask].map(char => {
    switch (char) {
      case 'O':
        return WordleHint.Correct;
      case 'V':
        return WordleHint.Misplaced;
      case 'X':
        return WordleHint.Missing;
      default:
        throw "invalid mask returned from wasm"
    }
  });

  return hints
}

export const validateHard = async (word: string, ...guesses: string[]): Promise<boolean> => {
  const wordleCloneLib = await wordleClone;
  const concat = guesses.join("\n");
  return wordleCloneLib.validate_hard(word, concat);
}

export const validateHardcore = async (word: string, ...guesses: string[]): Promise<boolean> => {
  const wordleCloneLib = await wordleClone;
  const concat = guesses.join("\n");
  return wordleCloneLib.validate_hard(word, concat);
}
