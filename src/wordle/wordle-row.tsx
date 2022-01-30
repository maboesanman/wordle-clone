import React from "react";

export interface RowData {
  length: number;
  guess: string;
  entered: boolean;
  word: Promise<string>;
}

export interface Props {
  data: RowData
}

const WordleRowComponent: React.FC<Props> = (props) => {
  return <div>{props.data.guess}</div>
}

export default WordleRowComponent;
