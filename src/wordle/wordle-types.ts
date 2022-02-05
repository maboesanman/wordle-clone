import { libPromise, WordleHint } from "../lib"

export interface RowData {
  length: number;
  guess: string;
  entered: boolean;
  lazy?: RowDataLazy;
}

export interface RowDataLazy {
  word: string,
  lib: Awaited<typeof libPromise>,
}

export interface LetterDataEntered {
  entered: true;
  character: string;
  hint: WordleHint;
}

export interface LetterDataUnentered {
  entered: false;
  character?: string;
}

export type LetterData = LetterDataEntered | LetterDataUnentered;

export interface KeyboardHints {
  a?: WordleHint,
  b?: WordleHint,
  c?: WordleHint,
  d?: WordleHint,
  e?: WordleHint,
  f?: WordleHint,
  g?: WordleHint,
  h?: WordleHint,
  i?: WordleHint,
  j?: WordleHint,
  k?: WordleHint,
  l?: WordleHint,
  m?: WordleHint,
  n?: WordleHint,
  o?: WordleHint,
  p?: WordleHint,
  q?: WordleHint,
  r?: WordleHint,
  s?: WordleHint,
  t?: WordleHint,
  u?: WordleHint,
  v?: WordleHint,
  w?: WordleHint,
  x?: WordleHint,
  y?: WordleHint,
  z?: WordleHint,
}

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

export type WordleEvent = WordleEnterEvent | WordleBackEvent | WordleLetterEvent;

export interface GameState {
  guesses: string[];
  length: number;
  rows: number;
  victory: boolean;
  complete: boolean;
  lazyState?: LazyState;
}

export interface LazyState {
  word: string,
  lib: Awaited<typeof libPromise>,
}

export type GameAction = GameKeyboardAction | GameLoadedAction;

export interface GameKeyboardAction {
  type: "keyboard";
  event: WordleEvent;
}

export interface GameLoadedAction {
  type: "loaded";
  lazyState: LazyState;
}