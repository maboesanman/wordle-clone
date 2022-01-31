import React from "react";
import { getString, WordleEvent } from "./events"

import styles from "./keyboard.module.scss";

interface Props {
  event: WordleEvent
}

const WordleKeyboardLabelComponent: React.FC<Props> = (props) => {
  return <div className={styles["label"]}>{getString(props.event)}</div>
}

export default WordleKeyboardLabelComponent;
