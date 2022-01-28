import React, { useEffect, useState } from "react";

const wordleClone = import("wordle-clone");


const App = () => {
  const [word, setWord] = useState("sdf");
  const randomize = () => wordleClone.then(wordleClone => {
    setWord(wordleClone.get_random_word(5));
  });

  useEffect(() => {
    randomize()
  }, [])

  return (
    <div>
      <p>{word}</p>
      <button onClick={randomize}>Randomize</button>
    </div>
  )
};

export default App;
