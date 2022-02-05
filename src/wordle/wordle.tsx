import React, { useEffect, useReducer, useState } from "react";
import { libPromise } from "./../lib";
import gameStateReducer from "./wordle-reducer";
import WordleBoardComponent from "./wordle-board";
import Keyboard from "./keyboard";
import { GameAction, GameState, WordleEvent } from "./wordle-types";
import ResultComponent from "./result";

import styles from "./wordle.module.scss";
import { wordleRows } from "./lib";

export interface Props {
  length: number;
  rows?: number;
  word?: string;
  mode: "normal" | "hard" | "hardcore";
}

const WordleComponent: React.FC<Props> = (props) => {
  // these props can't react to change, so we make them state.
  const [length] = useState(props.length);
  const [rows] = useState(props.rows ?? 6);

  const [gameState, dispatch] = useReducer<React.Reducer<GameState, GameAction>>(gameStateReducer, {
    guesses: [""],
    length,
    rows,
    victory: false,
    complete: false,
  });

  useEffect(() => {
    libPromise.then((lib) => dispatch({
      type: "loaded",
      lazyState: {
        word: lib.getRandomWord(length),
        lib,
      }
    }));
  }, [length]);

  const rowData = wordleRows(gameState);

  const handleEvent = (event: WordleEvent) => dispatch({
    type: "keyboard",
    event,
  });

  return (
    <div className={styles["wordle__wrapper"]}>
      <div className={styles["wordle"]}>
        <div className={styles["wordle__board"]}>
          <WordleBoardComponent rows={rowData} />
        </div>
        <div className={styles["wordle__result"]}>
          {gameState.complete && gameState.lazyState ? <ResultComponent victory={gameState.victory} word={gameState.lazyState.word} /> : undefined}
        </div>
        <div className={styles["wordle__keyboard"]}>
          <Keyboard eventHandler={handleEvent} rowData={rowData} />
        </div>
      </div>
    </div>
  )
};

export default WordleComponent;
