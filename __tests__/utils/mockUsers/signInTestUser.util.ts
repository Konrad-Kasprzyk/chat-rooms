import { Collections } from "db/client/firebase";
import { doc, updateDoc } from "firebase/firestore";
import testCollectionsId from "../setup/testCollectionsId.constant";
import MockedFirebaseAuth from "./mockedFirebaseAuth.class";
import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default async function signInTestUser(
  uid: string
): Promise<{ uid: string; email: string; displayName: string }> {
  const user = MockedFirebaseUser.registeredMockUsers.find((user) => user.uid == uid);
  if (!user) throw `Couldn't find the test user with uid ${uid}`;
  if (!testCollectionsId) throw "testCollectionsId is not a non-empty string.";
  await updateDoc(doc(Collections.testCollections, testCollectionsId), {
    signedInTestUserId: user.uid,
  });
  const mockedAuth = MockedFirebaseAuth.Instance;
  mockedAuth.currentUser = user;
  return mockedAuth.currentUser;
}
