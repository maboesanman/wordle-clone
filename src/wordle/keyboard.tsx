import React, { useEffect, useState } from "react";
import { WordleHint } from "../lib";
import { WORDLE_BACK_EVENT, WORDLE_ENTER_EVENT } from "./events";
import { RowData, WordleEvent, WordleEventType, WordleLetterEvent } from "./wordle-types";
import KeyboardButton from "./keyboard-button"

import styles from "./keyboard.module.scss";
import { getAggregateHints } from "./lib";

export interface KeyboardHints {
  a?: WordleHint,
  b?: WordleHint,
  c?: WordleHint,
  d?: WordleHint,
  e?: WordleHint,
  f?: WordleHint,
  g?: WordleHint,
  h?: WordleHint,
  i?: WordleHint,
  j?: WordleHint,
  k?: WordleHint,
  l?: WordleHint,
  m?: WordleHint,
  n?: WordleHint,
  o?: WordleHint,
  p?: WordleHint,
  q?: WordleHint,
  r?: WordleHint,
  s?: WordleHint,
  t?: WordleHint,
  u?: WordleHint,
  v?: WordleHint,
  w?: WordleHint,
  x?: WordleHint,
  y?: WordleHint,
  z?: WordleHint,
}

interface Props {
  eventHandler: (event: WordleEvent) => void,
  rowData: RowData[],
}

const KeyboardComponent: React.FC<Props> = (props) => {
  const [hintsPromise, setHintsPromise] = useState<Promise<Record<string, WordleHint>>>(getAggregateHints(props.rowData));
  const [hints, setHints] = useState<Record<string, WordleHint>>({})

  useEffect(() => {
    setHintsPromise(getAggregateHints(props.rowData));
  }, [props.rowData])

  useEffect(() => {
    hintsPromise.then(l => setHints(l));
  }, [hintsPromise])

  const renderButton = (letter: string) => {
    const event: WordleLetterEvent = {
      type: WordleEventType.Letter,
      letter,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hint = hints[letter];
    return <KeyboardButton key={letter} eventHandler={props.eventHandler} event={event} hint={hint}/>
  };

  const renderRow = (letters: string) => [...letters].map(renderButton);

  return (
    <div className={styles.keyboard}>
      <div className={styles.keyboard__row}>
        {renderRow("qwertyuiop")}
      </div>
      <div className={styles.keyboard__row}>
        <div className={styles["button-spacer"]} />
        {renderRow("asdfghjkl")}
        <div className={styles["button-spacer"]} />
      </div>
      <div className={styles.keyboard__row}>
        <KeyboardButton eventHandler={props.eventHandler} event={WORDLE_BACK_EVENT}/>
        {renderRow("zxcvbnm")}
        <KeyboardButton eventHandler={props.eventHandler} event={WORDLE_ENTER_EVENT}/>
      </div>
    </div>
  );
}

export default KeyboardComponent;
