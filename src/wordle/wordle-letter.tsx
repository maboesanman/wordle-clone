import React from "react";
import { WordleHint } from "../lib";
import { LetterData } from "./wordle-types";

import styles from "./board.module.scss";

const WordleLetterComponent: React.FC<LetterData> = (props) => {
  const statusClassNames = () => {
    const base = "wordle__letter";
    if(props.entered) {
      switch(props.hint) {
        case WordleHint.Correct:
          return [`${base}--correct`];
        case WordleHint.Misplaced:
          return [`${base}--misplaced`];
        case WordleHint.Missing:
          return [`${base}--missing`];
      }
    } else {
      return [];
    }
  }
  const classNames = ["wordle__letter", ...statusClassNames()];
  const classes = classNames.map(className => styles[className]);
  const className = classes.join(" ");
  return <div className={className}>
    <div className={styles["wordle__letter__inner"]}>
      {props.character}
    </div>
  </div>
}

export default WordleLetterComponent;