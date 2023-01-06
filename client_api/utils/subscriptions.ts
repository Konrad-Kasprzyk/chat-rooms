// TODO: check if works. Maybe hold eventlisteners. add and remove for each modification with addToUnsubscribe and unsubscribeAndRemove

import { Unsubscribe } from "firebase/firestore";

const unsubscribes: Unsubscribe[] = [];

export function addToUnsubscribe(unsubscribe: Unsubscribe): void {
  if (unsubscribes.includes(unsubscribe)) return;
  unsubscribes.push(unsubscribe);
}

export function unsubscribeAndRemove(unsubscribe: Unsubscribe): void {
  const unsubscribeIndex = unsubscribes.indexOf(unsubscribe);
  if (unsubscribeIndex < 0) return;
  unsubscribes[unsubscribeIndex]();
  unsubscribes.splice(unsubscribeIndex, 1);
}

window.addEventListener("beforeunload", () => {
  for (const unsubscribe of unsubscribes) {
    unsubscribe();
  }
});
