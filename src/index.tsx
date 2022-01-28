import React from "react";
import ReactDOM from "react-dom";

import RandomWord from "./random-word";


const App = () => {
  return (
    <div>
      <h1>My React and TypeScript App!</h1>
      <RandomWord />
    </div>
  )
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
