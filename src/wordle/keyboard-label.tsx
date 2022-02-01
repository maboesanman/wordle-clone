import React from "react";
import { getString } from "./events"
import { WordleEvent } from "./wordle-types";

import styles from "./keyboard.module.scss";

interface Props {
  event: WordleEvent
}

const WordleKeyboardLabelComponent: React.FC<Props> = (props) => {
  return <div className={styles["label"]}>{getString(props.event)}</div>
}

export default WordleKeyboardLabelComponent;
