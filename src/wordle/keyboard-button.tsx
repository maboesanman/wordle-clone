import React from "react";
import { WordleHint } from "../lib";
import { WordleEvent, WordleEventType } from "./events";
import WordleKeyboardLabelComponent from "./keyboard-label";

interface Props {
  eventHandler: (event: WordleEvent) => void,
  hint?: WordleHint,
  event: WordleEvent
}

const classNames = (event: WordleEvent, hint?: WordleHint) => {
  const base = "wordle-keyboard-button";

  const classes = [base];

  switch(hint) {
    case WordleHint.Correct:
      classes.push(`${base}--correct`);
      break;
    case WordleHint.Misplaced:
      classes.push(`${base}--misplaced`);
      break;
    case WordleHint.Missing:
      classes.push(`${base}--missing`);
      break;
    default:
      break;
  }

  switch(event.type) {
    case WordleEventType.Back:
    case WordleEventType.Enter:
      classes.push(`${base}__control`);
      break;
    case WordleEventType.Letter:
      classes.push(`${base}__letter`);
      break;
    default:
      break;
  }

  return classes.join(" ");
}

const WordleKeyboardButtonComponent: React.FC<Props> = (props) => {
  return (
    <div
      className={classNames(props.event, props.hint)}
      onClick={() => props.eventHandler(props.event)}
    >
      <WordleKeyboardLabelComponent event={props.event} />
    </div>
  )
}

export default WordleKeyboardButtonComponent;
