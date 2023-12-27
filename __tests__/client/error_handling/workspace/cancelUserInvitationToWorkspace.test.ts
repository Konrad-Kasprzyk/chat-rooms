import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import cancelUserInvitationToWorkspace from "client_api/workspace/cancelUserInvitationToWorkspace.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of canceling a user invitation to a workspace.", () => {
  let workspaceId: string;

  /**
   * Creates the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
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

  it("Open workspace document not found, because the open workspace id is set to null.", async () => {
    expect.assertions(1);
    setOpenWorkspaceId(null);
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

    await expect(cancelUserInvitationToWorkspace("foo")).rejects.toThrow(
      "Open workspace document not found."
    );
  });

  it("Open workspace document not found, because has the deleted flag set.", async () => {
    expect.assertions(1);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

    await expect(cancelUserInvitationToWorkspace("foo")).rejects.toThrow(
      "Open workspace document not found."
    );

    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The user is not invited to the open workspace.", async () => {
    expect.assertions(1);

    await expect(cancelUserInvitationToWorkspace("foo")).rejects.toThrow(
      `The user with email foo is not invited to the open workspace.`
    );
  });
});
