import HISTORY_DTO_INIT_VALUES from "backend/constants/docsInitValues/historyDTOInitValues.constant";
import WORKSPACE_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceDTOInitValues.constant";
import WORKSPACE_SUMMARY_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceSummaryDTOInitValues.constant";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import HistoryModelDTOSchema from "common/DTOModels/historyModels/historyModelDTOSchema.interface";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * Creates a workspace with workspaceSummary and WorkspaceCounter documents.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL. If an empty string is provided, the workspace id is used as the URL.
 * @returns Created workspace id.
 * @throws {ApiError} When the workspace with provided url already exists.
 * When the user document is not found.
 */
export default async function createWorkspace(
  uid: string,
  title: string,
  description: string,
  url: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!title) throw new ApiError(400, "The provided title is an empty string.");
  const userRef = collections.users.doc(uid);
  const userDetailsRef = collections.userDetails.doc(uid);
  return adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const userDetailsPromise = transaction.get(userDetailsRef);
    const workspaceRef = collections.workspaces.doc();
    const workspaceUrl = url || workspaceRef.id;
    const workspacesWithProvidedUrlQuery = transaction.get(
      collections.workspaces.where("isDeleted", "==", false).where("url", "==", workspaceUrl)
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
    const workspacesWithProvidedUrlSnap = await workspacesWithProvidedUrlQuery;
    if (workspacesWithProvidedUrlSnap.size > 0)
      throw new ApiError(400, `The workspace with url ${url} already exists.`);
    const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceRef.id);
    const chatHistoryRef = collections.chatHistories.doc();
    const usersHistoryRef = collections.userHistories.doc();
    const workspaceHistoryRef = collections.workspaceHistories.doc();
    const workspaceModel: WorkspaceDTO = {
      ...WORKSPACE_DTO_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url: workspaceUrl,
        title,
        description,
        userIds: [uid],
        newestChatHistoryId: chatHistoryRef.id,
        newestUsersHistoryId: usersHistoryRef.id,
        newestWorkspaceHistoryId: workspaceHistoryRef.id,
      },
    };
    transaction.create(workspaceRef, workspaceModel);
    const workspaceSummaryModel: WorkspaceSummaryDTO = {
      ...WORKSPACE_SUMMARY_DTO_INIT_VALUES,
      ...{
        id: workspaceRef.id,
        url: workspaceUrl,
        title,
        description,
        userIds: [uid],
      },
    };
    transaction.create(workspaceSummaryRef, workspaceSummaryModel);
    const historyModelSkeleton: Omit<HistoryModelDTOSchema, "id"> = {
      ...HISTORY_DTO_INIT_VALUES,
      workspaceId: workspaceRef.id,
    };
    transaction.create(chatHistoryRef, {
      ...historyModelSkeleton,
      id: chatHistoryRef.id,
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
