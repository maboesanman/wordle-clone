import React from "react";
import ReactDOM from "react-dom";

import RandomWord from "./random-word";
import ValidateWord from "./validate-word";
import Wordle from "./wordle";


const App = () => {
  return (
    <div>
      <h1>My React and TypeScript App!</h1>
      <RandomWord />
      <ValidateWord />
      <Wordle />
    </div>
  )
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
