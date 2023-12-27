import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import changeWorkspaceTitle from "client_api/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of changing a workspace title.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;

  /**
   * Creates the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
  });

  /**
   * Ensures that the open workspace does not have the deleted flag set and is not in the recycle bin.
   */
  beforeEach(async () => {
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId &&
            workspace.isInBin == false &&
            workspace.isDeleted == false
        )
      )
    );
  });

  it("The provided new title is an empty string.", async () => {
    expect.assertions(1);
    await expect(changeWorkspaceTitle("")).rejects.toThrow(
      "The provided new title is an empty string."
    );
  });

  it("Open workspace document not found.", async () => {
    expect.assertions(1);
    setOpenWorkspaceId(null);
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

    await expect(changeWorkspaceTitle("foo")).rejects.toThrow("Open workspace document not found.");
  });

  it("The open workspace is in the recycle bin.", async () => {
    expect.assertions(1);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: workspaceCreatorId,
    });
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.isInBin == true))
    );

    await expect(changeWorkspaceTitle("foo")).rejects.toThrow(
      "The open workspace is in the recycle bin."
    );

    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: false,
      placingInBinTime: null,
      insertedIntoBinByUserId: null,
    });
  });
});
