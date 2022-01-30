import React from "react";
import { WordleHint } from "../lib";
import { WordleEvent, WordleEventType, WordleLetterEvent, WORDLE_BACK_EVENT, WORDLE_ENTER_EVENT } from "./events";
import KeyboardButton from "./keyboard-button"


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
  hints: KeyboardHints,
}

const KeyboardComponent: React.FC<Props> = (props) => {

  const renderButton = (letter: string) => {
    const event: WordleLetterEvent = {
      type: WordleEventType.Letter,
      letter,
    };
    return <KeyboardButton key={letter} eventHandler={props.eventHandler} event={event}/>
  };

  const renderRow = (letters: string) => [...letters].map(renderButton);

  return <div className="wordle-keyboard">
    <div className="wordle-keyboard__row-1">
      {renderRow("qwertyuiop")}
    </div>
    <div className="wordle-keyboard__row-2">
      {renderRow("asdfghjkl")}
    </div>
    <div className="wordle-keyboard__row-3">
      <KeyboardButton eventHandler={props.eventHandler} event={WORDLE_BACK_EVENT}/>
      {renderRow("zxcvbnm")}
      <KeyboardButton eventHandler={props.eventHandler} event={WORDLE_ENTER_EVENT}/>
    </div>
  </div>
}

export default KeyboardComponent;
