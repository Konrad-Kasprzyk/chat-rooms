import { db } from "../../db/firebase";
import { addDoc, collection, getDoc } from "firebase/firestore";
import path from "path";
import createUserAndSignIn from "../utils/createUserAndSignIn";
import signOutAndDeleteUser from "../utils/signOutAndDeleteUser";
import deleteCollections from "../utils/deleteCollections";
import COLLECTIONS from "../../global/constants/collections";
import getTestCollections from "../utils/getTestCollections";

describe("Create user and sign up", () => {
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

  it("asserts can read because is logged in", async () => {
    const docRef = await addDoc(collection(db, collections.workspaces), { title: "first project" });
    const projectSnap = await getDoc(docRef);
    const data = projectSnap.data();
    expect(data).toBeDefined();
    expect(data!.title).toBeDefined();
    expect(data!.title).toEqual("first project");
  });
});