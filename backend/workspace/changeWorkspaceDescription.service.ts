import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Changes the workspace description if the user belongs to it
 * @throws {ApiError} When the user document is not found.
 * When the user does not belong to the workspace or has the deleted flag set.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  collections: typeof adminCollections = adminCollections
) {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = userRef.get();
    const workspacePromise = workspaceRef.get();
    await Promise.all([userPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const workspace = (await workspaceRef.get()).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    const workspaceHistoryRef = collections.workspaceHistories.doc(
      workspace.newestWorkspaceHistoryId
    );
    const workspaceHistory = (await transaction.get(workspaceHistoryRef)).data();
    if (!workspaceHistory)
      throw new ApiError(
        500,
        `Found the workspace document, but couldn't find the workspace history document ` +
          `with id ${workspace.newestWorkspaceHistoryId}`
      );
    assertWorkspaceWriteable(workspace, user);
    const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
    transaction.update(workspaceRef, {
      description: newDescription,
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(workspaceSummaryRef, {
      description: newDescription,
      modificationTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<WorkspaceHistoryDTO>(
      transaction,
      workspaceHistory,
      {
        action: "description" as const,
        userId: uid,
        oldValue: workspace.description,
        value: newDescription,
      },
      collections.workspaceHistories
    );
  });
}
