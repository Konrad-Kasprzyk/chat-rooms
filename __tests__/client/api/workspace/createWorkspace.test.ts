import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_TEST_TIMEOUT from "__tests__/constants/longTestTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import createWorkspace from "clientApi/workspace/createWorkspace.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test client api creating a workspace.", () => {
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

  it("Creates a workspace.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createWorkspace(workspaceUrl, workspaceTitle, workspaceDescription);

    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
  });

  it(
    "Properly creates a workspace when many simultaneous requests are made.",
    async () => {
      const workspaceUrl = uuidv4();
      const promises = [];
      const workspaceCreationAttempts = 10;
      let rejectedWorkspaceCreationAttempts = 0;
      let workspaceId = "";

      for (let i = 0; i < workspaceCreationAttempts; i++)
        promises.push(createWorkspace(workspaceUrl, workspaceTitle, workspaceDescription));
      const responses = await Promise.allSettled(promises);
      for (const res of responses) {
        if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
        else workspaceId = res.value;
      }

      expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
      await checkNewlyCreatedWorkspace(
        workspaceId,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
    },
    LONG_TEST_TIMEOUT
  );
});
