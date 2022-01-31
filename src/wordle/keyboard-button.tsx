import React from "react";
import { WordleHint } from "../lib";
import { WordleEvent, WordleEventType } from "./events";
import WordleKeyboardLabelComponent from "./keyboard-label";

import styles from "./keyboard.module.scss"

interface Props {
  eventHandler: (event: WordleEvent) => void,
  hint?: WordleHint,
  event: WordleEvent
}

const classNames = (event: WordleEvent, hint?: WordleHint) => {
  const base = "button";

  const classes = [styles[base]];

  switch(hint) {
    case WordleHint.Correct:
      classes.push(styles[`${base}--correct`]);
      break;
    case WordleHint.Misplaced:
      classes.push(styles[`${base}--misplaced`]);
      break;
    case WordleHint.Missing:
      classes.push(styles[`${base}--missing`]);
      break;
    default:
      break;
  }

  switch(event.type) {
    case WordleEventType.Back:
    case WordleEventType.Enter:
      classes.push(styles[`${base}__control`]);
      break;
    case WordleEventType.Letter:
      classes.push(styles[`${base}__letter`]);
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
