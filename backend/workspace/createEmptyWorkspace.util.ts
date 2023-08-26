import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import User from "common/models/user.model";
import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";

/**
 * This function creates a new empty workspace with a unique URL and adds it to the database.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @param testing Marks that this workspace is used for tests.
 * This helps find undeleted documents from tests when teardown fails.
 * @returns a Promise that resolves to the id of newly created workspace.
 * @throws When the workspace with provided url already exists or user document is not found.
 */
export default async function createEmptyWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  const workspaceUrlRef = collections.workspaceUrls.doc(url);
  const workspaceUrlSnap = await workspaceUrlRef.get();
  if (workspaceUrlSnap.exists) throw new ApiError(400, `Workspace with url ${url} already exists.`);
  const userRef = collections.users.doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new ApiError(400, `User document with id ${uid} not found.`);
  const workspaceRef = collections.workspaces.doc();
  const workspaceCounterRef = collections.workspaceCounters.doc(workspaceRef.id);
  const batch = adminDb.batch();
  const workspaceModel: Workspace = {
    ...EMPTY_WORKSPACE_INIT_VALUES,
    ...{
      id: workspaceRef.id,
      url,
      title,
      description,
      userIds: [uid],
    },
  };
  batch.create(workspaceRef, workspaceModel);
  const workspaceUrl: WorkspaceUrl = {
    id: url,
  };
  batch.create(workspaceUrlRef, workspaceUrl);
  const workspaceCounter: WorkspaceCounter = {
    ...EMPTY_WORKSPACE_COUNTER_INIT_VALUES,
    ...{ id: workspaceCounterRef.id },
  };
  batch.create(workspaceCounterRef, workspaceCounter);
  batch.update(userRef, {
    workspaces: adminArrayUnion<User, "workspaces">({
      id: workspaceRef.id,
      url,
      title,
      description,
    }),
    workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceRef.id),
  });
  await batch.commit();
  // TODO it returns workspace with date fields set to FieldValue.serverTimestamp(), don't return this object
  return workspaceRef.id;
}
