import { db } from "../../db/firebase";
import {
  addDoc,
  and,
  collection,
  getDoc,
  getDocs,
  or,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import path from "path";
import createUserAndSignIn from "../utils/createUserAndSignIn";
import signOutAndDeleteUser from "../utils/signOutAndDeleteUser";
import deleteCollections from "../utils/deleteCollections";
import COLLECTIONS from "../../global/constants/collections";
import getTestCollections from "../utils/getTestCollections";

describe("Query limits", () => {
  it("asserts query runs", async () => {
    const q = query(
      collection(db, "tasks"),
      and(
        where("author", "==", "Raptor"),
        where("assignedUser", "in", ["Konrad", "a", "b", "c"]),
        // where("goals", "array-contains", ["g1"]),
        or(
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 42]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 13]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 35]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 36]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 37]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 38]),
          where("labels", "array-contains", ["a", "u", "c", "r", "p", "o", "i", 39])
        )
      )

      // where("assignmentTime", "<=", Timestamp.now()),
      // where("assignmentTime", ">=", Timestamp.fromDate(new Date(2023, 2, 1))),
      // where("completionTime", "<=", Timestamp.now()),
      // where("completionTime", ">=", Timestamp.fromDate(new Date(2023, 2, 1)))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  });
});
