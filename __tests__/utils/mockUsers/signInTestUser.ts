import COLLECTIONS from "common/constants/collections";
import { db } from "db/firebase";
import { doc, updateDoc } from "firebase/firestore";
import testCollectionsId from "../setup/testCollectionsId";
import MockedFirebaseAuth from "./mockedFirebaseAuth";
import MockedFirebaseUser from "./mockedFirebaseUser";

export default async function signInTestUser(
  uid: string
): Promise<{ uid: string; email: string; displayName: string }> {
  const user = MockedFirebaseUser.registeredMockUsers.find((user) => user.uid == uid);
  if (!user) throw `Couldn't find the test user with uid ${uid}`;
  if (!testCollectionsId) throw "testCollectionsId is not a non-empty string.";
  await updateDoc(doc(db, COLLECTIONS.testCollections, testCollectionsId), {
    signedInTestUserId: user.uid,
  });
  const mockedAuth = MockedFirebaseAuth.Instance;
  mockedAuth.currentUser = user;
  return mockedAuth.currentUser;
}