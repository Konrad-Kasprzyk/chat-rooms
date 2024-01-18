import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_TEST_TIMEOUT from "__tests__/constants/longTestTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedEmptyWorkspace from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test client api creating an empty workspace", () => {
  const workspaceTitle = "First project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;

  /**
   * Creates and signs in the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("Creates an empty workspace.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createEmptyWorkspace(
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );

    await checkNewlyCreatedEmptyWorkspace(
      workspaceId,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
  });

  it(
    "Properly creates an empty workspace when many simultaneous requests are made.",
    async () => {
      const workspaceUrl = uuidv4();
      const promises = [];
      const workspaceCreationAttempts = 10;
      let rejectedWorkspaceCreationAttempts = 0;
      let workspaceId = "";

      for (let i = 0; i < workspaceCreationAttempts; i++)
        promises.push(createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription));
      const responses = await Promise.allSettled(promises);
      for (const res of responses) {
        if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
        else workspaceId = res.value;
      }

      expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
      await checkNewlyCreatedEmptyWorkspace(
        workspaceId,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
    },
    LONG_TEST_TIMEOUT
  );
});
