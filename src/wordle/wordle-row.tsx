import React, { useEffect, useState } from "react";
import { LetterData, RowData } from "./wordle-types";
import WordleLetterComponent from "./wordle-letter";

import { splitRow, splitRowSkipHint } from "./lib";

import styles from "./board.module.scss";

interface Props {
  row: RowData;
}

const WordleRowComponent: React.FC<Props> = (props) => {
  const [lettersPromise, setLettersPromise] = useState<Promise<LetterData[]>>(splitRow(props.row));
  const [letters, setLetters] = useState<LetterData[]>(splitRowSkipHint(props.row))

  useEffect(() => {
    setLettersPromise(splitRow(props.row));
    setLetters(splitRowSkipHint(props.row));
  }, [props.row])

  useEffect(() => {
    lettersPromise.then(l => setLetters(l));
  }, [lettersPromise])

  return <div className={styles["wordle__row"]}>{
    letters.map((letterData, i) => <WordleLetterComponent key={i} letter={letterData} />)
  }</div>
}

export default WordleRowComponent;
