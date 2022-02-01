import React, { useEffect, useState } from "react";
import { LetterData, RowData } from "./wordle-types";
import { evaluateGuess, WordleHint } from "./../lib";
import WordleLetterComponent from "./wordle-letter";


const WordleRowComponent: React.FC<RowData> = (props) => {
  const [hintsPromise, setHintsPromise] = useState<undefined | Promise<WordleHint[]>>(undefined);
  const [hints, setHints] = useState<undefined | WordleHint[]>(undefined);
  
  useEffect(() => {
    if(props.entered) {
      if(hintsPromise === undefined) {
        const newPromise = props.word.then(w => evaluateGuess(w, props.guess));
        setHintsPromise(newPromise)
        setHints(undefined)
        newPromise.then(h => setHints(h))
      }
    } else {
      setHintsPromise(undefined)
      setHints(undefined)
    }
  }, [props.entered, props.guess, props.word, hintsPromise])

  const letters: LetterData[] = [];
  for(let i = 0; i < props.length; i++) {
    if(hints !== undefined) {
      letters.push({
        entered: true,
        character: props.guess[i],
        hint: hints[i],
      })
    } else {
      letters.push({
        entered: false,
        character: props.guess[i],
      })
    }
  }
  // debugger;

  return <div>{
    letters.map((letterData, i) => <WordleLetterComponent key={i} {...letterData} />)
  }</div>
}

export default WordleRowComponent;
