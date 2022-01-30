import React from "react";
import { getString, WordleEvent } from "./events"

interface Props {
  event: WordleEvent
}

const WordleKeyboardLabelComponent: React.FC<Props> = (props) => {
  return <div>{getString(props.event)}</div>
}

export default WordleKeyboardLabelComponent;
