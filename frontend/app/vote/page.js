'use client';
import { useState, useEffect } from "react"

const Vote = () => {

  const [number, setNumber] = useState(0);

  const increment = () => {
    setNumber(number + 1);
  }

  useEffect(() => {
    console.log('Number a changé');
  }, [number])

  return (
    <>
    <div>Vote : La variable number est égale à : {number}</div>
    <button onClick={increment}>Incrémenter</button>
    </>
  )
}

export default Vote
