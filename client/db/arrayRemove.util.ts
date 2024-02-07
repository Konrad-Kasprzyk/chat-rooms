import AllClientModels from "common/types/allClientModels.type";
import { FieldValue, arrayRemove as firestoreArrayRemove } from "firebase/firestore";

export default function arrayRemove<T extends AllClientModels, K extends keyof T>(
  ...elements: T[K] extends Array<any> ? Array<T[K][number]> : never
): FieldValue {
  return firestoreArrayRemove(...elements);
}
