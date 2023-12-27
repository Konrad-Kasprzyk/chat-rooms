import signOut from "client_api/user/signOut.api";
import { _setSignedInUserId } from "client_api/user/signedInUserId.utils";
import collections from "common/db/collections.firebase";
import { doc, updateDoc } from "firebase/firestore";
import testCollectionsId from "../setup/testCollectionsId.constant";
import MockedFirebaseAuth from "./mockedFirebaseAuth.class";
import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default async function signInTestUser(
  uid: string
): Promise<{ uid: string; email: string; displayName: string }> {
  const user = MockedFirebaseUser.registeredMockUsers.find((user) => user.uid == uid);
  if (!user) throw new Error(`Couldn't find the test user with uid ${uid}`);
  if (!testCollectionsId) throw new Error("testCollectionsId is not a non-empty string.");
  const mockedAuth = MockedFirebaseAuth.Instance;
  if (mockedAuth.currentUser) signOut();
  await updateDoc(doc(collections.testCollections, testCollectionsId), {
    signedInTestUserId: user.uid,
  });
  mockedAuth.currentUser = user;
  _setSignedInUserId(uid);
  return mockedAuth.currentUser;
}
