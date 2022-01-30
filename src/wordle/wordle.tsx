import React, { useEffect, useState } from "react";
import { getRandomWord } from "./../lib";
import WordleRowComponent, { RowData } from "./wordle-row";
import Keyboard, { KeyboardHints } from "./keyboard";
import { WordleEvent, WordleEventType } from "./events";

export interface Props {
  length: number;
  rows?: number;
  word?: string;
}

const WordleComponent: React.FC<Props> = (props) => {
  // these props can't react to change, so we make them state.
  const [word, setWord] = useState(props.word);
  const [length] = useState(props.length);
  const [rows] = useState(props.rows ?? 6);

  // set random word if not already present.
  useEffect(() => {
    getRandomWord(length).then(randomWord => setWord(randomWord));
  }, [length]);

  const [guesses, setGuesses] = useState<string[]>([""]);
  const getCurrentGuess = () => guesses[guesses.length - 1];
  const setCurrentGuess = (v: string) => {
    const newGuesses = [...guesses];
    newGuesses[newGuesses.length - 1] = v;
    setGuesses(newGuesses);
  };

  const wordleRows: () => RowData[] = () => {
    const result: RowData[] = [];
    for (let i = 0; i < rows; i++) {
      result.push({
        length,
        guess: guesses[i] ?? "",
        entered: guesses.length - 1 > i,
      })
    }
    return result
  }

  const handleEvent = (event: WordleEvent) => {
    const currentGuess = getCurrentGuess()
    switch(event.type) {
      case(WordleEventType.Letter):
        if(currentGuess.length < length) {
          setCurrentGuess(currentGuess + event.letter);
        }
        break;
      case(WordleEventType.Back):
        if(currentGuess.length > 0) {
          setCurrentGuess(currentGuess.slice(0, -1));
        }
        break;
      case(WordleEventType.Enter):
        if(currentGuess.length == length) {
          setGuesses([...guesses, ""]);
        }
        break;
    }
  }

  const keyboardHints: () => KeyboardHints = () => {
    return {}
  }

  return (<div>
    {word}
    <div className="wordle-board">
      {wordleRows().map((rowData, i) => <WordleRowComponent key={i} data={rowData} />)}
    </div>
    <Keyboard eventHandler={handleEvent} hints={keyboardHints()} />
  </div>)
};

export default WordleComponent;
