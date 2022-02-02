import React from "react";
import { WordleHint } from "../lib";
import { LetterData } from "./wordle-types";

import styles from "./board.module.scss";

interface Props {
  letter: LetterData
}

const WordleLetterComponent: React.FC<Props> = (props) => {
  const statusClassNames = () => {
    const base = "wordle__letter";
    if(props.letter.entered) {
      switch(props.letter.hint) {
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
      {props.letter.character}
    </div>
  </div>
}

export default WordleLetterComponent;