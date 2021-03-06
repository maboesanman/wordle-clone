import React from "react";
import ReactDOM from "react-dom";

import Wordle from "./wordle/wordle";

import "./global.scss";

const App = () => {
  return (
    <Wordle length={5} mode="normal" />
  )
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
