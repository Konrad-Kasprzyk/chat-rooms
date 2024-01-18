import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceCounterInitValues.constant";
import WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceInitValues.constant";
import WORKSPACE_SUMMARY_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceSummaryInitValues.constant";
import User from "common/models/user.model";
import Workspace from "common/models/workspaceModels/workspace.model";
import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";
import WorkspaceSummary from "common/models/workspaceModels/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Creates a workspace with workspaceSummary and WorkspaceCounter documents.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @returns Created workspace id.
 * @throws {ApiError} When the workspace with provided url already exists.
 * When the user document is not found or has the deleted flag set.
 */
export default async function createWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!url) throw new ApiError(400, "The provided url is an empty string.");
  if (!title) throw new ApiError(400, "The provided title is an empty string.");
  const userRef = collections.users.doc(uid);
  return adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const workspacesWithProvidedUrlQuery = transaction.get(
      collections.workspaces.where("isDeleted", "==", false).where("url", "==", url)
    );
    await Promise.all([userPromise, workspacesWithProvidedUrlQuery]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
    const workspacesWithProvidedUrlSnap = await workspacesWithProvidedUrlQuery;
    if (workspacesWithProvidedUrlSnap.size > 0)
      throw new ApiError(400, `The workspace with url ${url} already exists.`);
    const workspaceRef = collections.workspaces.doc();
    const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceRef.id);
    const workspaceCounterRef = collections.workspaceCounters.doc(workspaceRef.id);
    const workspaceModel: Workspace = {
      ...WORKSPACE_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url,
        title,
        description,
        userIds: [uid],
      },
    };
    transaction.create(workspaceRef, workspaceModel);
    const workspaceSummaryModel: WorkspaceSummary = {
      ...WORKSPACE_SUMMARY_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url,
        title,
        description,
        userIds: [uid],
      },
    };
    transaction.create(workspaceSummaryRef, workspaceSummaryModel);
    const workspaceCounter: WorkspaceCounter = {
      ...WORKSPACE_COUNTER_INIT_VALUES,
      ...{ id: workspaceRef.id },
    };
    transaction.create(workspaceCounterRef, workspaceCounter);
    transaction.update(userRef, {
      workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceRef.id),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    return workspaceRef.id;
  });
}
