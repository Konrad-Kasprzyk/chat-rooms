import COLLECTIONS from "common/constants/collections.constant";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import User from "common/models/user.model";
import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceCounter from "common/models/workspace_models/workspaceCounter.model";
import ApiError from "common/types/apiError.class";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * This function creates a new empty workspace with a unique URL and adds it to the database.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @param testing Marks that this workspace is used for tests.
 * This helps find undeleted documents from tests when teardown fails.
 * @returns a Promise that resolves to the newly created workspace.
 * @throws When the workspace with provided url already exists or user document is not found.
 */
export async function createEmptyWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<Workspace> {
  const workspaceUrlRef = adminDb.collection(collections.workspaceUrls).doc(url);
  const workspaceUrlSnap = await workspaceUrlRef.get();
  if (workspaceUrlSnap.exists) throw new ApiError(400, `Workspace with url ${url} already exists.`);
  const userRef = adminDb.collection(collections.users).doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new ApiError(400, `User document with id ${uid} not found.`);
  const workspaceRef = adminDb.collection(collections.workspaces).doc();
  const workspaceId = workspaceRef.id;
  const workspaceCounterRef = adminDb.collection(collections.counters).doc();
  const counterId = workspaceCounterRef.id;
  const batch = adminDb.batch();
  const workspaceModel: Workspace = {
    ...EMPTY_WORKSPACE_INIT_VALUES,
    ...{
      id: workspaceId,
      url,
      title,
      description,
      counterId,
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
    ...{ id: counterId, workspaceId: workspaceId },
  };
  batch.create(workspaceCounterRef, workspaceCounter);
  batch.update(userRef, {
    workspaces: FieldValue.arrayUnion({
      id: workspaceId,
      url,
      title,
      description,
    } satisfies User["workspaces"][number]),
    workspaceIds: FieldValue.arrayUnion(workspaceId satisfies User["workspaceIds"][number]),
  });
  await batch.commit();
  return workspaceModel;
}
