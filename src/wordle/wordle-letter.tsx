import React from "react";
import { LetterData } from "./wordle-types";

const WordleLetterComponent: React.FC<LetterData> = (props) => {
  return <div>{props.character ?? "_"}</div>
}

export default WordleLetterComponent;