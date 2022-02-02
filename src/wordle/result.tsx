import React from "react"

import styles from "./result.module.scss"

interface Props {
  victory: boolean,
  word: string,
}

const ResultComponent: React.FC<Props> = (props) => {
  return <div className={styles["result"]}>
    {(props.victory) ? "🎉" : `💩 word was "${props.word}"`}
  </div>
}

export default ResultComponent;