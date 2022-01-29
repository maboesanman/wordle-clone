import React, { useState } from "react";

const wordleClone = import("wordle-clone");


const ValidateWord = () => {
  const [isValid, setIsValid] = useState(false);
  const validate = (w: string) => wordleClone.then(wordleClone => {
    setIsValid(wordleClone.validate_word(w))
  });

  return (
    <div>
      <input type="text"
        onInput={e => validate((e.target as HTMLTextAreaElement).value) } />
      <p>{isValid ? "true" : "false"}</p>
    </div>
  )
};

export default ValidateWord;
