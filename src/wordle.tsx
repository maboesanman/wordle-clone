import React from "react";
import type { ImportClass } from "./utils"

const WordleClonePromise = import("wordle-clone");
type Wordle = ImportClass<typeof import("wordle-clone"), "Wordle">;

interface State {
  wordle?: Wordle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wordleState?: any;
}

export default class WordleComponent extends React.Component<unknown, State> {
  constructor(props: unknown){
    super(props);
    this.state = { wordle: undefined, wordleState: undefined };
  }
  componentDidMount(): void {
    WordleClonePromise.then(WordleClone => {
      const Wordle = WordleClone.Wordle;
      this.setState(() => ({ wordle: new Wordle(5) }))
    })
  }
  makeRandomGuess(): void {
    WordleClonePromise.then(WordleClone => {
      const get_random_word = WordleClone.get_random_word;
      const guess = get_random_word(5);
      this.setState((prev) => {
        prev.wordle?.guess(guess);
        return { wordleState: prev.wordle?.current_state() }
      })
      this.state.wordle?.guess(guess);
    })
  }
  render() {
    const wordle = this.state.wordle;
    if(wordle === undefined) {
      return <div>Loading</div>
    } else {
      const str = JSON.stringify(this.state.wordleState);
      return (
        <div>
          <pre>{str}</pre>
          <button onClick={() => this.makeRandomGuess()}>guess randomly</button>
        </div>
      )
    }
  }
  componentWillUnmount() {
    this.state.wordle?.free()
  }
}