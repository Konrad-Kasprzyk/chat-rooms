import HISTORY_DTO_INIT_VALUES from "backend/constants/docsInitValues/historyDTOInitValues.constant";
import WORKSPACE_COUNTER_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceCounterDTOInitValues.constant";
import WORKSPACE_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceDTOInitValues.constant";
import WORKSPACE_SUMMARY_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceSummaryDTOInitValues.constant";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import HistoryModelDTOSchema from "common/DTOModels/historyModels/historyModelDTOSchema.interface";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

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
  const userDetailsRef = collections.userDetails.doc(uid);
  return adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const userDetailsPromise = transaction.get(userDetailsRef);
    const workspacesWithProvidedUrlQuery = transaction.get(
      collections.workspaces.where("isDeleted", "==", false).where("url", "==", url)
    );
    await Promise.all([userPromise, userDetailsPromise, workspacesWithProvidedUrlQuery]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const userDetails = (await userDetailsPromise).data();
    if (!userDetails)
      throw new ApiError(
        500,
        `Found the user document, but the user details document with id ${uid} is not found.`
      );
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
    const workspacesWithProvidedUrlSnap = await workspacesWithProvidedUrlQuery;
    if (workspacesWithProvidedUrlSnap.size > 0)
      throw new ApiError(400, `The workspace with url ${url} already exists.`);
    const workspaceRef = collections.workspaces.doc();
    const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceRef.id);
    const workspaceCounterRef = collections.workspaceCounters.doc(workspaceRef.id);
    const archivedGoalsRef = collections.goalArchives.doc();
    const archivedTasksRef = collections.taskArchives.doc();
    const columnsHistoryRef = collections.columnHistories.doc();
    const labelsHistoryRef = collections.labelHistories.doc();
    const usersHistoryRef = collections.userHistories.doc();
    const workspaceHistoryRef = collections.workspaceHistories.doc();
    const workspaceModel: WorkspaceDTO = {
      ...WORKSPACE_DTO_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url,
        title,
        description,
        userIds: [uid],
        newestArchivedGoalsId: archivedGoalsRef.id,
        newestArchivedTasksId: archivedTasksRef.id,
        newestColumnsHistoryId: columnsHistoryRef.id,
        newestLabelsHistoryId: labelsHistoryRef.id,
        newestUsersHistoryId: usersHistoryRef.id,
        newestWorkspaceHistoryId: workspaceHistoryRef.id,
      },
    };
    transaction.create(workspaceRef, workspaceModel);
    const workspaceSummaryModel: WorkspaceSummaryDTO = {
      ...WORKSPACE_SUMMARY_DTO_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url,
        title,
        description,
        userIds: [uid],
      },
    };
    transaction.create(workspaceSummaryRef, workspaceSummaryModel);
    const workspaceCounter: WorkspaceCounterDTO = {
      ...WORKSPACE_COUNTER_DTO_INIT_VALUES,
      ...{ id: workspaceRef.id },
    };
    transaction.create(workspaceCounterRef, workspaceCounter);
    const historyModelSkeleton: Omit<HistoryModelDTOSchema, "id"> = {
      ...HISTORY_DTO_INIT_VALUES,
      workspaceId: workspaceRef.id,
    };
    transaction.create(archivedGoalsRef, {
      ...historyModelSkeleton,
      id: archivedGoalsRef.id,
    });
    transaction.create(archivedTasksRef, {
      ...historyModelSkeleton,
      id: archivedTasksRef.id,
    });
    transaction.create(columnsHistoryRef, {
      ...historyModelSkeleton,
      id: columnsHistoryRef.id,
    });
    transaction.create(labelsHistoryRef, {
      ...historyModelSkeleton,
      id: labelsHistoryRef.id,
    });
    transaction.create(usersHistoryRef, {
      ...historyModelSkeleton,
      id: usersHistoryRef.id,
    });
    transaction.create(workspaceHistoryRef, {
      ...historyModelSkeleton,
      id: workspaceHistoryRef.id,
      history: {
        "0": {
          id: 0,
          action: "creationTime" as const,
          userId: uid,
          date: FieldValue.serverTimestamp() as Timestamp,
          oldValue: null,
          value: FieldValue.serverTimestamp() as Timestamp,
        },
      },
      historyRecordsCount: 1,
    });
    transaction.update(userRef, {
      workspaceIds: adminArrayUnion<UserDTO, "workspaceIds">(workspaceRef.id),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.userDetails.doc(userDetails.mainUserId), {
      allLinkedUserBelongingWorkspaceIds: adminArrayUnion<
        UserDetailsDTO,
        "allLinkedUserBelongingWorkspaceIds"
      >(workspaceRef.id),
    });
    return workspaceRef.id;
  });
}
