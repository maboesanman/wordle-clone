import React from "react";
import { RowData } from "./wordle-types";
import WordleLetterComponent from "./wordle-letter";

import { splitRow } from "./lib";

import styles from "./board.module.scss";

interface Props {
  row: RowData;
}

const WordleRowComponent: React.FC<Props> = (props) => {
  const letters = splitRow(props.row);

  return <div className={styles["wordle__row"]}>{
    letters.map((letterData, i) => <WordleLetterComponent key={i} letter={letterData} />)
  }</div>
}

export default WordleRowComponent;
