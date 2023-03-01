import { db } from "../../db/firebase";
import { addDoc, collection, getDoc, getDocs, orderBy, query, startAt } from "firebase/firestore";
import path from "path";
import createUserAndSignIn from "../utils/createUserAndSignIn";
import signOutAndDeleteUser from "../utils/signOutAndDeleteUser";
import deleteCollections from "../utils/deleteCollections";
import COLLECTIONS from "../../global/constants/collections";
import getTestCollections from "../utils/getTestCollections";

describe("Test sorting and limiting results", () => {
  let collections: typeof COLLECTIONS;

  beforeAll(async () => {
    const filename = path.parse(__filename).name;
    const user = await createUserAndSignIn(filename);
    collections = getTestCollections(user.uid);
  });

  afterAll(async () => {
    await signOutAndDeleteUser();
    await deleteCollections(collections);
  });

  it("asserts can sort multiple fields", async () => {
    await addDoc(collection(db, collections.workspaces), { letter: "a", number: 1 });
    await addDoc(collection(db, collections.workspaces), { letter: "b", number: 1 });
    await addDoc(collection(db, collections.workspaces), { letter: "c", number: 1 });
    await addDoc(collection(db, collections.workspaces), { letter: "a", number: 2 });
    await addDoc(collection(db, collections.workspaces), { letter: "b", number: 2 });
    await addDoc(collection(db, collections.workspaces), { letter: "c", number: 2 });
    await addDoc(collection(db, collections.workspaces), { letter: "b", number: 4 });
    await addDoc(collection(db, collections.workspaces), { letter: "c", number: 4 });
    await addDoc(collection(db, collections.workspaces), { letter: "a", number: 4 });
    await addDoc(collection(db, collections.workspaces), { letter: "c", number: 3 });
    await addDoc(collection(db, collections.workspaces), { letter: "a", number: 3 });
    await addDoc(collection(db, collections.workspaces), { letter: "b", number: 3 });
    const q = query(
      collection(db, collections.workspaces),
      orderBy("letter"),

      orderBy("number"),

      startAt("b")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  });
});
