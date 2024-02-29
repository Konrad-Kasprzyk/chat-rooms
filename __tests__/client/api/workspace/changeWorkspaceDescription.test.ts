import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import compareNewestWorkspaceHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestWorkspaceHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
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
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("Properly changes the workspace description", async () => {
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    expect(workspace!.description).not.toEqual("");
    const oldModificationTime = workspace!.modificationTime;
    const oldDescription = workspace!.description;
    const newDescription = "changed " + workspace!.description;

    changeWorkspaceDescription(newDescription);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.description == newDescription
        )
      )
    );
    expect(workspace!.description).toEqual(newDescription);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspace!.title,
      workspace!.description,
      workspace!.url
    );
    await compareNewestWorkspaceHistoryRecord(workspace!, {
      action: "description",
      userId: workspacesOwner.uid,
      date: workspace!.modificationTime,
      oldValue: oldDescription,
      value: newDescription,
    });
  });

  it("Properly changes the workspace description to an empty description", async () => {
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    expect(workspace!.description).not.toEqual("");
    const oldModificationTime = workspace!.modificationTime;
    const oldDescription = workspace!.description;

    changeWorkspaceDescription("");

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.description == "")
      )
    );
    expect(workspace!.description).toEqual("");
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspace!.title,
      workspace!.description,
      workspace!.url
    );
    await compareNewestWorkspaceHistoryRecord(workspace!, {
      action: "description",
      userId: workspacesOwner.uid,
      date: workspace!.modificationTime,
      oldValue: oldDescription,
      value: "",
    });
  });

  it("Properly changes the workspace description from an empty description", async () => {
    await changeWorkspaceDescription("");
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.description == "")
      )
    );
    expect(workspace!.description).toEqual("");
    const oldModificationTime = workspace!.modificationTime;
    const newDescription = "test description";

    changeWorkspaceDescription(newDescription);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.description == newDescription
        )
      )
    );
    expect(workspace!.description).toEqual(newDescription);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspace!.title,
      workspace!.description,
      workspace!.url
    );
    await compareNewestWorkspaceHistoryRecord(workspace!, {
      action: "description",
      userId: workspacesOwner.uid,
      date: workspace!.modificationTime,
      oldValue: "",
      value: newDescription,
    });
  });
});
