"use client";

import db from "client/db/db.firebase";
import { addDoc, collection, getDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import collections from "../../common/constants/collectionPaths.constant";

export default function Time() {
  async function getServerTime() {
    const docRef = await addDoc(collection(db, collections.workspaces), {
      title: "first project",
      currentTime: serverTimestamp(),
    });
    const projectSnap = await getDoc(docRef);
    const data = projectSnap.data();
    setServerTime(data!.currentTime.toDate());
  }
  const [time, setTime] = useState(new Date());
  const [serverTime, setServerTime] = useState(new Date());

  return (
    <main>
      <h1>Checking time</h1>
      <div>normal{time.toString()}</div>
      <div>ISO string{time.toISOString()}</div>
      <div>UTC string{time.toISOString()}</div>
      <button
        onClick={() => {
          setTime(new Date());
        }}
      >
        Set current time
      </button>
      <br />
      <div>server time {serverTime.toString()}</div>
      <button onClick={() => getServerTime()}>get server time</button>
    </main>
  );
}
