import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import collections from "clientApi/db/collections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test workspaces collection firestore rules denying access.", () => {
  let testUserId: string;
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test user.
   */
  beforeEach(async () => {
    testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  });

  it("The signed in user can't read a workspace document to which he does not belong.", async () => {
    expect.assertions(1);
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const workspaceId = await createTestWorkspace(filename);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUserId && user.workspaceIds.length == 1)
      )
    );
    await leaveWorkspace(workspaceId);

    await expect(getDoc(doc(collections.workspaces, workspaceId))).rejects.toThrow(FirebaseError);
  });

  it("The signed in user can't get a list of workspace documents, even if the list contains only workspaces to which he belongs.", async () => {
    expect.assertions(1);
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const workspaceId = await createTestWorkspace(filename);

    await expect(
      getDocs(query(collections.workspaces, where("id", "==", workspaceId)))
    ).rejects.toThrow(FirebaseError);
  });
});
