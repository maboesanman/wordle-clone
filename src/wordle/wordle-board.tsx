import React from "react";
import WordleRowComponent from "./wordle-row";
import { RowData } from "./wordle-types";

import styles from "./board.module.scss";

export interface Props {
  rows: RowData[]
}

const WordleBoardComponent: React.FC<Props> = (props) => {
  return <div className={styles["wordle__board"]}>
    {props.rows.map((rowData, i) => <WordleRowComponent key={i} {...rowData} />)}
  </div>
}

export default WordleBoardComponent;
