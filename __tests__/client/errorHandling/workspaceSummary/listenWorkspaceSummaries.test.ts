import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenWorkspaceSummaries, {
  _listenWorkspaceSummariesExportedForTesting,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import auth from "client/db/auth.firebase";
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
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    await checkWorkspace(workspaceIds[0]);
    await checkWorkspace(workspaceIds[workspaceIds.length - 1]);
  });

  it("After an error, the subject returns updated workspace summaries.", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );
    if (!_listenWorkspaceSummariesExportedForTesting)
      throw new Error("listenWorkspaceSummaries.api module didn't export functions for testing.");

    _listenWorkspaceSummariesExportedForTesting.setSubjectError();
    await removeUsersFromWorkspace(workspaceIds[0], [workspaceOwnerId]);
    const workspaceSummaries = await firstValueFrom(
      listenWorkspaceSummaries().pipe(filter((ws) => ws.docs.length == workspaceIds.length - 1))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds.slice(1));
    /**
     * Type 'added' because the listener will receive new workspace summaries as it will be newly
     * created after an error.
     */
    expect(workspaceSummaries.updates.every((update) => update.type == "added")).toBeTrue();
  });
});
