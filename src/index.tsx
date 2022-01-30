import React from "react";
import ReactDOM from "react-dom";

import Wordle from "./wordle/wordle";

const App = () => {
  return (
    <Wordle length={6} />
  )
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
