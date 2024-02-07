import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import collections from "client/db/collections.firebase";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";

describe("Test userDetails collection firestore rules denying access.", () => {
  let signedUserId: string;
  let otherUserId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates test users.
   */
  beforeEach(async () => {
    const testUsers = await registerAndCreateTestUserDocuments(2);
    signedUserId = testUsers[0].uid;
    otherUserId = testUsers[1].uid;
  });

  it("The signed in user can't read another userDetails document", async () => {
    expect.assertions(1);
    await signInTestUser(signedUserId);

    await expect(getDoc(doc(collections.userDetails, otherUserId))).rejects.toThrow(FirebaseError);
  });

  it("The signed in user can't get a list of userDetails documents, even if the list contains only himself", async () => {
    expect.assertions(1);
    await signInTestUser(signedUserId);

    await expect(
      getDocs(query(collections.userDetails, where("id", "==", signedUserId)))
    ).rejects.toThrow(FirebaseError);
  });
});
