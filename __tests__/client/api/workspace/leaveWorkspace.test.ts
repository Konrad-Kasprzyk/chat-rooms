import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test leaving the open workspace.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceId: string;
  let oldModificationTime: Date;

  /**
   * Creates and opens the test workspace
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    oldModificationTime = workspace!.modificationTime;
  }, BEFORE_ALL_TIMEOUT);

  it("Leaves the open workspace", async () => {
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    await leaveWorkspace();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

    expect(getOpenWorkspaceId()).toBeNull();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == workspacesOwner.uid &&
            !user.dataFromFirebaseAccount &&
            user.workspaceIds.length == 0
        )
      )
    );
    expect(userDoc!.workspaceIds).toBeArrayOfSize(0);
    const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspace.userIds).toBeArrayOfSize(0);
    expect(workspace.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const workspaceSummary = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummary.userIds).toBeArrayOfSize(0);
    expect(workspaceSummary.modificationTime.toDate()).toBeAfter(oldModificationTime);
    await checkWorkspace(workspace.id);
  });
});
