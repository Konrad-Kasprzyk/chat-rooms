import { FieldValue } from "firebase-admin/firestore";

export default function adminArrayUnion<T extends object, K extends keyof T>(
  ...elements: T[K] extends Array<any> ? Array<T[K][number]> : never
): FieldValue {
  return FieldValue.arrayUnion(...elements);
}
