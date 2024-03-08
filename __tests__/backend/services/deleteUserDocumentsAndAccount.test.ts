jest.mock<typeof import("backend/db/adminAuth.firebase")>("backend/db/adminAuth.firebase", () => {
  const deleteUser = jest.fn();
  return {
    __esModule: true,
    default: { deleteUser } as any,
  };
});

const OPTIMAL_MAX_OPERATIONS_PER_COMMIT = 8;

jest.mock<typeof import("backend/constants/optimalMaxOperationsPerCommit.constant")>(
  "backend/constants/optimalMaxOperationsPerCommit.constant",
  () => {
    /**
     * Testing function should take two workspaces per transaction.
     */
    const OPTIMAL_MAX_OPERATIONS_PER_COMMIT = 8;

    return {
      __esModule: true,
      default: OPTIMAL_MAX_OPERATIONS_PER_COMMIT as any,
    };
  }
);

import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDTODocs/deletedOrMarkedAsDeleted/checkDeletedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import deleteUserDocumentsAndAccount, {
  _markUserDeletedExportedForTesting,
} from "backend/user/deleteUserDocumentsAndAccount.service";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test deleting user documents and account.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Deletes user documents in a single transaction.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    const testUser = (await adminCollections.users.doc(testUserId).get()).data()!;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const userDetails = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetails.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    const botIds = userDetails.linkedUserDocumentIds.filter((id: string) => id != testUserId);
    const botsSnap = await adminCollections.users.where("id", "in", botIds).get();
    const bots = botsSnap.docs.map((doc) => doc.data());
    const belongingUsers = [...bots.slice(0, botIds.length / 2), testUser];
    const invitedUsers = bots.slice(bots.length / 2);
    await addUsersToWorkspace(
      workspaceId,
      bots.slice(0, botIds.length / 2).map((bot) => bot.id),
      bots.slice(bots.length / 2).map((bot) => bot.email)
    );

    await deleteUserDocumentsAndAccount(testUserId, adminCollections);

    const allTestUsersSnap = await adminCollections.users
      .where("id", "in", userDetails.linkedUserDocumentIds)
      .get();
    expect(allTestUsersSnap.size).toEqual(0);
    await Promise.all(userDetails.linkedUserDocumentIds.map((uid) => checkDeletedUser(uid)));
    const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    const commitTime = workspace.modificationTime;
    expect(workspace.modificationTime).toEqual(commitTime);
    expect(workspace.userIds).toBeArrayOfSize(0);
    expect(workspace.invitedUserEmails).toBeArrayOfSize(0);
    const usersHistory = (
      await adminCollections.userHistories.doc(workspace.newestUsersHistoryId).get()
    ).data()!;
    expect(usersHistory.modificationTime).toEqual(commitTime);
    for (let i = 0; i < botIds.length + 1; i++) {
      const historyRecord = usersHistory.history[usersHistory.historyRecordsCount - 1 - i];
      expect(historyRecord.date).toEqual(commitTime);
      expect(historyRecord.action).toBeOneOf(["invitedUserEmails", "userRemovedFromWorkspace"]);
      if (historyRecord.action == "userRemovedFromWorkspace") {
        expect(historyRecord.userId).toEqual(historyRecord.oldValue!.id);
        const removedUser = belongingUsers.find((user) => user.id == historyRecord.userId)!;
        expect(removedUser).toBeDefined();
        expect(historyRecord.oldValue).toEqual({
          id: removedUser.id,
          email: removedUser.email,
          username: removedUser.username,
          isBotUserDocument: removedUser.isBotUserDocument,
        });
        expect(historyRecord.value).toEqual(null);
      } else {
        expect(historyRecord.action).toEqual("invitedUserEmails");
        const invitedUser = invitedUsers.find((user) => user.email == historyRecord.oldValue)!;
        expect(invitedUser).toBeDefined();
        expect(historyRecord.userId).toEqual(invitedUser.id);
        expect(historyRecord.oldValue).toEqual(invitedUser.email);
        expect(historyRecord.value).toBeNull();
      }
    }
  });

  it("Deletes user documents with multiple transactions.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    const testUser = (await adminCollections.users.doc(testUserId).get()).data()!;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    if (!_markUserDeletedExportedForTesting)
      throw new Error("markUserDeleted.service module didn't export functions for testing.");
    // Testing function should make 3 transactions.
    const workspaceCount =
      Math.ceil(
        OPTIMAL_MAX_OPERATIONS_PER_COMMIT /
          _markUserDeletedExportedForTesting.operationsPerWorkspace
      ) *
        2 +
      1;
    const workspaceIds = [];
    for (let i = 0; i < workspaceCount; i++) workspaceIds.push(await createTestWorkspace(filename));
    workspaceIds.sort();
    const userDetails = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetails.allLinkedUserBelongingWorkspaceIds.sort()).toEqual(workspaceIds);
    const botIds = userDetails.linkedUserDocumentIds.filter((id: string) => id != testUserId);
    const botsSnap = await adminCollections.users.where("id", "in", botIds).get();
    const bots = botsSnap.docs.map((doc) => doc.data());
    const belongingUsers = [...bots.slice(0, botIds.length / 2), testUser];
    const invitedUsers = bots.slice(bots.length / 2);
    await Promise.all(
      workspaceIds.map((workspaceId) =>
        addUsersToWorkspace(
          workspaceId,
          bots.slice(0, botIds.length / 2).map((bot) => bot.id),
          bots.slice(bots.length / 2).map((bot) => bot.email)
        )
      )
    );

    await deleteUserDocumentsAndAccount(testUserId, adminCollections);

    const allTestUsersSnap = await adminCollections.users
      .where("id", "in", userDetails.linkedUserDocumentIds)
      .get();
    expect(allTestUsersSnap.size).toEqual(0);
    await Promise.all(userDetails.linkedUserDocumentIds.map((uid) => checkDeletedUser(uid)));
    for (const workspaceId of workspaceIds) {
      const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
      const currentCommitTime = workspace.modificationTime;
      expect(workspace.userIds).toBeArrayOfSize(0);
      expect(workspace.invitedUserEmails).toBeArrayOfSize(0);
      const usersHistory = (
        await adminCollections.userHistories.doc(workspace.newestUsersHistoryId).get()
      ).data()!;
      expect(usersHistory.modificationTime).toEqual(currentCommitTime);
      for (let i = 0; i < botIds.length + 1; i++) {
        const historyRecord = usersHistory.history[usersHistory.historyRecordsCount - 1 - i];
        expect(historyRecord.date).toEqual(currentCommitTime);
        expect(historyRecord.action).toBeOneOf(["invitedUserEmails", "userRemovedFromWorkspace"]);
        if (historyRecord.action == "userRemovedFromWorkspace") {
          expect(historyRecord.userId).toEqual(historyRecord.oldValue!.id);
          const removedUser = belongingUsers.find((user) => user.id == historyRecord.userId)!;
          expect(removedUser).toBeDefined();
          expect(historyRecord.oldValue).toEqual({
            id: removedUser.id,
            email: removedUser.email,
            username: removedUser.username,
            isBotUserDocument: removedUser.isBotUserDocument,
          });
          expect(historyRecord.value).toEqual(null);
        } else {
          expect(historyRecord.action).toEqual("invitedUserEmails");
          const invitedUser = invitedUsers.find((user) => user.email == historyRecord.oldValue)!;
          expect(invitedUser).toBeDefined();
          expect(historyRecord.userId).toEqual(invitedUser.id);
          expect(historyRecord.oldValue).toEqual(invitedUser.email);
          expect(historyRecord.value).toBeNull();
        }
      }
    }
  });
});
