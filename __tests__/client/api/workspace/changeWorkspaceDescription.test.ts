import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import changeWorkspaceDescription from "client_api/workspace/changeWorkspaceDescription.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test changing the workspace description.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceId: string;

  /**
   * Creates and opens the workspace to test changing the description.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspacesOwner.uid))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("Properly changes the workspace description", async () => {
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    expect(workspace?.description).not.toEqual("");
    const oldModificationTime = workspace!.modificationTime.toMillis();
    const newDescription = "changed " + workspace!.description;

    changeWorkspaceDescription(newDescription);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.description == newDescription
        )
      )
    );
    expect(workspace?.description).toEqual(newDescription);
    expect(workspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Properly changes the workspace description to an empty description", async () => {
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    expect(workspace?.description).not.toEqual("");
    const oldModificationTime = workspace!.modificationTime.toMillis();

    changeWorkspaceDescription("");

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.description == "")
      )
    );
    expect(workspace?.description).toEqual("");
    expect(workspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Properly changes the workspace description from an empty description", async () => {
    await changeWorkspaceDescription("");
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.description == "")
      )
    );
    expect(workspace?.description).toEqual("");
    const oldModificationTime = workspace!.modificationTime.toMillis();
    const newDescription = "test description";

    changeWorkspaceDescription(newDescription);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.description == newDescription
        )
      )
    );
    expect(workspace?.description).toEqual(newDescription);
    expect(workspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });
});
