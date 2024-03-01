"use client";

import { useState } from "react";

export default function Time() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>number</h1>
      <h1>{number}</h1>

      <button onClick={() => setNumber(number + 1)}>click Me to increase number</button>
    </>
  );
}
