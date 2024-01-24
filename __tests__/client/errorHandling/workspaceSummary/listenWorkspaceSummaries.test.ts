import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import auth from "clientApi/db/auth.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenWorkspaceSummaries, {
  _listenWorkspaceSummariesExportedForTesting,
} from "clientApi/workspaceSummary/listenWorkspaceSummaries.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

let workspaceIds: string[] = [];
let workspaceOwnerId: string;

describe("Test errors of listening the workspace summaries of the signed in user.", () => {
  /**
   * Creates test workspaces whose workspace summaries will be used in tests.
   * Sorts created workspace ids.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 4; i++) workspaceIds.push(await createTestWorkspace(filename));
    workspaceIds.sort();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspaces owner.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid != workspaceOwnerId)
      await signInTestUser(workspaceOwnerId);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceOwnerId && !user.dataFromFirebaseAccount)
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    await checkWorkspace(workspaceIds[0]);
    await checkWorkspace(workspaceIds[workspaceIds.length - 1]);
  });

  it("After an error and function re-call, the subject returns all workspace summaries.", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );
    if (!_listenWorkspaceSummariesExportedForTesting)
      throw new Error("listenWorkspaceSummaries.api module didn't export functions for testing.");

    _listenWorkspaceSummariesExportedForTesting.setSubjectError();
    await expect(firstValueFrom(workspaceSummariesSubject)).toReject();
    const workspaceSummaries = await firstValueFrom(
      listenWorkspaceSummaries().pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });
});
