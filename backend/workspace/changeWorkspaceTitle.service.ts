import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Changes the workspace title if the user belongs to it
 * @throws {ApiError} When the user document is not found.
 * When the provided title is an empty string.
 * When the user does not belong to the workspace.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function changeWorkspaceTitle(
  uid: string,
  workspaceId: string,
  newTitle: string,
  collections: typeof adminCollections = adminCollections
) {
  if (!newTitle) throw new ApiError(400, "The provided new title is an empty string.");
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
      title: newTitle,
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(workspaceSummaryRef, {
      title: newTitle,
      modificationTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<WorkspaceHistoryDTO>(
      transaction,
      workspaceHistory,
      {
        action: "title" as const,
        userId: uid,
        oldValue: workspace.title,
        value: newTitle,
      },
      collections.workspaceHistories
    );
  });
}
