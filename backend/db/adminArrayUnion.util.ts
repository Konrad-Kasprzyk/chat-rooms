import AllDTOModels from "common/types/allDTOModels.type";
import { FieldValue } from "firebase-admin/firestore";

export default function adminArrayUnion<T extends AllDTOModels, K extends keyof T>(
  ...elements: T[K] extends Array<any> ? Array<T[K][number]> : never
): FieldValue {
  return FieldValue.arrayUnion(...elements);
}
