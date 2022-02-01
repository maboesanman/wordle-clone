import React from "react";
import WordleRowComponent from "./wordle-row";
import { RowData } from "./wordle-types";

export interface Props {
  rows: RowData[]
}

const WordleBoardComponent: React.FC<Props> = (props) => {
  return <div className="wordle__board">
    {props.rows.map((rowData, i) => <WordleRowComponent key={i} {...rowData} />)}
  </div>
}

export default WordleBoardComponent;
