import { WordleBackEvent, WordleEnterEvent, WordleEvent, WordleEventType } from "./wordle-types";


export const getString: (event: WordleEvent) => string = (event) => {
  switch(event.type) {
  case WordleEventType.Enter:
    return "↵";
  case WordleEventType.Back:
    return "⌫";
  case WordleEventType.Letter:
    return event.letter;
  default:
    return ""
  }
}

export const WORDLE_ENTER_EVENT: WordleEnterEvent = {
  type: WordleEventType.Enter,
}

export const WORDLE_BACK_EVENT: WordleBackEvent = {
  type: WordleEventType.Back,
}