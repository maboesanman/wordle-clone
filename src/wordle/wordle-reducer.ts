import { GameAction, GameState, WordleEventType } from "./wordle-types";

const gameStateReducer: React.Reducer<GameState, GameAction> = (state, action) => {
  const newState = {
    ...state,
    guesses: [...state.guesses],
  }
  if(action.type === "loaded") {
    newState.lazyState = action.lazyState;
    return newState;
  }
  const loading = newState.guesses.length > 1 && newState.lazyState === undefined;
  if(loading) {
    return newState;
  }
  const currentGuess = newState.guesses[newState.guesses.length - 1];
  const setCurrentGuess = (g: string) => {
    newState.guesses[newState.guesses.length - 1] = g;
  }

  const event = action.event;
  switch(event.type) {
    case(WordleEventType.Letter):
      if(currentGuess.length === state.length) break;
      if(state.complete) break;

      setCurrentGuess(currentGuess + event.letter);
      break;
    case(WordleEventType.Back):
      if(currentGuess.length === 0) break;

      setCurrentGuess(currentGuess.slice(0, -1));
      break;
    case(WordleEventType.Enter):
      if(currentGuess.length !== state.length) break;
      if(currentGuess === newState.lazyState?.word) {
        newState.complete = true;
        newState.victory = true;
        newState.guesses.push("");
        break;
      }

      const wordValid = newState.lazyState?.lib.validateWord(currentGuess);
      if(!wordValid) break;

      if(newState.guesses.length === newState.rows) {
        newState.complete = true;
        newState.victory = false;
      }
      newState.guesses.push("");
      
      break;
  }
  return newState;
}

export default gameStateReducer;