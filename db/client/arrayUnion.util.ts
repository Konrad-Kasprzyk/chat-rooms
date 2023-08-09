import { FieldValue, arrayUnion as firestoreArrayUnion } from "firebase/firestore";

export default function arrayUnion<T extends object, K extends keyof T>(
  ...elements: T[K] extends Array<any> ? Array<T[K][number]> : never
): FieldValue {
  return firestoreArrayUnion(...elements);
}
