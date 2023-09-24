import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import WORKSPACE_SUMMARY_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceSummaryInitValues.constant";
import User from "common/models/user.model";
import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";

/**
 * Creates an empty workspace with a workspaceSummary.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @returns Created workspace id.
 * @throws When the workspace with provided url already exists or the user document is not found.
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
  const workspaceRef = collections.workspaces.doc();
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceRef.id);
  const workspaceCounterRef = collections.workspaceCounters.doc(workspaceRef.id);
  const userRef = collections.users.doc(uid);
  const batch = adminDb.batch();
  const workspaceUrl: WorkspaceUrl = {
    id: url,
  };
  batch.create(workspaceUrlRef, workspaceUrl);
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
  const workspaceSummaryModel: WorkspaceSummary = {
    ...WORKSPACE_SUMMARY_INIT_VALUES,
    ...{
      id: workspaceRef.id,
      url,
      title,
      description,
    },
  };
  batch.create(workspaceSummaryRef, workspaceSummaryModel);
  const workspaceCounter: WorkspaceCounter = {
    ...EMPTY_WORKSPACE_COUNTER_INIT_VALUES,
    ...{ id: workspaceRef.id },
  };
  batch.create(workspaceCounterRef, workspaceCounter);
  // If the user doesn't exist, this update will be rejected.
  batch.update(userRef, {
    workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceRef.id),
  });
  await batch.commit();
  return workspaceRef.id;
}
