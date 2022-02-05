const wordleClone = import(/* webpackPreload: true */ "wordle-clone");

export const getRandomWord = async (n: number): Promise<string> => {
  return (await libPromise).getRandomWord(n);
}

export const validateWord = async (word: string): Promise<boolean> => {
  return (await libPromise).validateWord(word);
}

export enum WordleHint {
  Correct = 2,
  Misplaced = 1,
  Missing = 0,
}

export const evaluateGuess = async (word: string, guess: string): Promise<WordleHint[]> => {
  return (await libPromise).evaluateGuess(word, guess);
}

export const validateHard = async (word: string, ...guesses: string[]): Promise<boolean> => {
  return (await libPromise).validateHard(word, ...guesses);
}

export const validateHardcore = async (word: string, ...guesses: string[]): Promise<boolean> => {
  return (await libPromise).validateHardcore(word, ...guesses);
}

export const libPromise = (async () => {
  const wordleCloneLib = await wordleClone;

  const getRandomWord = (n: number): string => {
    return wordleCloneLib.get_random_word(n)
  }
  
  const validateWord = (word: string): boolean => {
    return wordleCloneLib.validate_word(word)
  }
  
  
  const evaluateGuess = (word: string, guess: string): WordleHint[] => {
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
  
  const validateHard = (word: string, ...guesses: string[]): boolean => {
    const concat = guesses.join("\n");
    return wordleCloneLib.validate_hard(word, concat);
  }
  
  const validateHardcore = (word: string, ...guesses: string[]): boolean => {
    const concat = guesses.join("\n");
    return wordleCloneLib.validate_hard(word, concat);
  }

  return {
    getRandomWord,
    validateWord,
    evaluateGuess,
    validateHard,
    validateHardcore,
  }
})();