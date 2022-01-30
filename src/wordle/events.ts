
export enum WordleEventType {
  Enter,
  Back,

  // THIS SHOULD ALWAYS BE LOWERCASE
  Letter,
}

export interface WordleEnterEvent {
  type: WordleEventType.Enter;
}

export interface WordleBackEvent {
  type: WordleEventType.Back;
}

export interface WordleLetterEvent {
  type: WordleEventType.Letter;
  letter: string;
}

export const WORDLE_ENTER_EVENT: WordleEnterEvent = {
  type: WordleEventType.Enter,
}

export const WORDLE_BACK_EVENT: WordleBackEvent = {
  type: WordleEventType.Back,
}

export type WordleEvent = WordleEnterEvent | WordleBackEvent | WordleLetterEvent;

export const getString: (event: WordleEvent) => string = (event) => {
  switch(event.type) {
  case WordleEventType.Enter:
    return "Enter";
  case WordleEventType.Back:
    return "Back";
  case WordleEventType.Letter:
    return event.letter;
  default:
    return ""
  }
}