import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import checkWorkspace from "__tests__/utils/checkDocs/checkWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { removeUsersFromWorkspace } from "__tests__/utils/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "client_api/user/acceptWorkspaceInvitation.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import signOut from "client_api/user/signOut.api";
import changeWorkspaceTitle from "client_api/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import listenWorkspaceSummaries, {
  _listenWorkspaceSummariesExportedForTesting,
} from "client_api/workspaceSummary/listenWorkspaceSummaries.api";
import auth from "common/db/auth.firebase";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

let workspaceIds: string[] = [];
let workspaceOwnerId: string;
let testUsers: Readonly<{
  uid: string;
  email: string;
  displayName: string;
}>[];
/**
 * Sorted testUsers with workspaceOwnerId.
 */
let allTestUsersIds: string[];

describe("Test client api returning subject listening workspace summaries of the signed in user.", () => {
  /**
   * Creates test users and workspaces whose workspace summaries will be used in tests.
   * Sorts test users by uid and sorts workspace ids.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    testUsers = await registerAndCreateTestUserDocuments(3);
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 4; i++) workspaceIds.push(await createTestEmptyWorkspace(filename));
    testUsers.sort((u1, u2) => {
      if (u1.uid < u2.uid) return -1;
      if (u1.uid === u2.uid) return 0;
      return 1;
    });
    workspaceIds.sort();
    allTestUsersIds = [...testUsers.map((user) => user.uid), workspaceOwnerId];
    allTestUsersIds.sort();
  });

  /**
   * Signs in the workspaces owner. Ensures that the workspace owner is the only member of each workspace.
   * Removes all other users from the test workspaces and cancels all invitations to them.
   * Checks that each test workspace is not in the recycle bin, marked as removed, or removed.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid != workspaceOwnerId) {
      await signInTestUser(workspaceOwnerId);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId))
      );
    }
    const testWorkspacesSnap = await adminCollections.workspaces
      .where("id", "in", workspaceIds)
      .get();
    expect(testWorkspacesSnap.size).toEqual(workspaceIds.length);
    const testWorkspaces = testWorkspacesSnap.docs.map((doc) => doc.data());
    const promises = [];
    for (const workspace of testWorkspaces) {
      expect(workspace?.isDeleted).toBeFalse();
      expect(workspace?.isInBin).toBeFalse();
      expect(workspace?.userIds).toContain(workspaceOwnerId);
      const usersToRemoveFromWorkspace = workspace!.userIds.filter(
        (uid) => uid != workspaceOwnerId
      );
      const userEmailsToCancelInvitation = workspace!.invitedUserEmails;
      if (usersToRemoveFromWorkspace.length > 0 || userEmailsToCancelInvitation.length > 0)
        promises.push(
          removeUsersFromWorkspace(
            workspace.id,
            usersToRemoveFromWorkspace,
            userEmailsToCancelInvitation
          )
        );
    }
    await Promise.all(promises);
    await firstValueFrom(
      listenWorkspaceSummaries().pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs.every((ws) => ws.userIds.length == 1 && ws.invitedUserEmails.length == 0)
        )
      )
    );
  });

  // All operations are performed on the first workspace, but just in case check also the last workspace.
  afterEach(async () => {
    await checkWorkspace(workspaceIds[0]);
    await checkWorkspace(workspaceIds[workspaceIds.length - 1]);
  });

  it("Subject returns an empty array, when the current user doesn't belong to any workspace", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));

    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  it("Subject returns all workspace summaries, when no other user belongs to workspaces", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();

    const workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all workspace summaries, when many other users belong to workspaces " +
      "and the function to get the subject is used only once.",
    async () => {
      const workspaceSummariesSubject = listenWorkspaceSummaries();
      let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
      const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

      await Promise.all(
        workspaceIds.map((workspaceId) =>
          addUsersToWorkspace(
            workspaceId,
            testUsers.map((user) => user.uid)
          )
        )
      );
      workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(
          filter(
            (ws) =>
              ws.docs.length == workspaceIds.length &&
              ws.docs.every((ws) => ws.userIds.length == allTestUsersIds.length)
          )
        )
      );

      expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
      for (const ws of workspaceSummaries.docs) {
        expect(ws.userIds).toEqual(allTestUsersIds);
        expect(ws.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
      }
      expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
      for (const update of workspaceSummaries.updates) {
        expect(update.type).toEqual("modified");
        expect(update.doc.userIds).toEqual(allTestUsersIds);
        expect(update.doc.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
      }
    }
  );

  it(
    "Subject returns all workspace summaries, when many other users belong to workspaces " +
      "and the subject is retrieved again from the function.",
    async () => {
      let workspaceSummaries = await firstValueFrom(listenWorkspaceSummaries());
      const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

      await Promise.all(
        workspaceIds.map((workspaceId) =>
          addUsersToWorkspace(
            workspaceId,
            testUsers.map((user) => user.uid)
          )
        )
      );
      await firstValueFrom(
        listenWorkspaceSummaries().pipe(
          filter(
            (ws) =>
              ws.docs.length == workspaceIds.length &&
              ws.docs.every((ws) => ws.userIds.length == allTestUsersIds.length)
          )
        )
      );
      workspaceSummaries = await firstValueFrom(listenWorkspaceSummaries());

      expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
      for (const ws of workspaceSummaries.docs) {
        expect(ws.userIds).toEqual(allTestUsersIds);
        expect(ws.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
      }
      expect(workspaceSummaries.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns all workspace summaries, when many other users are invited to workspaces", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await Promise.all(
      workspaceIds.map((workspaceId) =>
        addUsersToWorkspace(
          workspaceId,
          [],
          testUsers.map((user) => user.email)
        )
      )
    );
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs.every((ws) => ws.invitedUserEmails.length == testUsers.length)
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    for (const ws of workspaceSummaries.docs) {
      expect(ws.userIds).toEqual([workspaceOwnerId]);
      expect(ws.invitedUserEmails).toEqual(testUsers.map((user) => user.email).sort());
      expect(ws.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    }
    expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
    for (const update of workspaceSummaries.updates) {
      expect(update.type).toEqual("modified");
      expect(update.doc.userIds).toEqual([workspaceOwnerId]);
      expect(update.doc.invitedUserEmails).toEqual(testUsers.map((user) => user.email).sort());
      expect(update.doc.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    }
  });

  it("Subject returns all workspace summaries, when the single user is invited to workspaces", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await Promise.all(
      workspaceIds.map((workspaceId) => addUsersToWorkspace(workspaceId, [], [testUsers[0].email]))
    );
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs.every((ws) => ws.invitedUserEmails.length == 1)
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    for (const ws of workspaceSummaries.docs) {
      expect(ws.userIds).toEqual([workspaceOwnerId]);
      expect(ws.invitedUserEmails).toEqual([testUsers[0].email]);
      expect(ws.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    }
    expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
    for (const update of workspaceSummaries.updates) {
      expect(update.type).toEqual("modified");
      expect(update.doc.userIds).toEqual([workspaceOwnerId]);
      expect(update.doc.invitedUserEmails).toEqual([testUsers[0].email]);
      expect(update.doc.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    }
  });

  it(
    "Subject returns all workspace summaries, when the current user belongs to some workspaces" +
      " and is invited to some workspaces",
    async () => {
      await signInTestUser(testUsers[0].uid);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid))
      );
      const workspaceSummariesSubject = listenWorkspaceSummaries();

      await Promise.all(
        workspaceIds
          .slice(0, 2)
          .map((workspaceId) => addUsersToWorkspace(workspaceId, [testUsers[0].uid]))
      );
      await Promise.all(
        workspaceIds
          .slice(2)
          .map((workspaceId) => addUsersToWorkspace(workspaceId, [], [testUsers[0].email]))
      );
      const workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
      );

      expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
      for (const ws of workspaceSummaries.docs.slice(0, 2)) {
        expect(ws.userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
        expect(ws.invitedUserEmails).toBeArrayOfSize(0);
      }
      for (const ws of workspaceSummaries.docs.slice(2)) {
        expect(ws.userIds).toEqual([workspaceOwnerId]);
        expect(ws.invitedUserEmails).toEqual([testUsers[0].email]);
      }
      expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
      for (const update of workspaceSummaries.updates) {
        expect(update.type).toEqual("added");
        if (workspaceIds.slice(0, 2).includes(update.doc.id)) {
          expect(update.doc.userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
          expect(update.doc.invitedUserEmails).toBeArrayOfSize(0);
        } else {
          expect(update.doc.userIds).toEqual([workspaceOwnerId]);
          expect(update.doc.invitedUserEmails).toEqual([testUsers[0].email]);
        }
      }
    }
  );

  it("Subject returns a single workspace summary, when the current user belongs to a single workspace.", async () => {
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    const workspaceSummariesSubject = listenWorkspaceSummaries();

    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 1))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
    expect(workspaceSummaries.docs[0].invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toBeArrayOfSize(0);
  });

  it("Subject returns a single workspace summary, when the current user is only invited to a one workspace", async () => {
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    const workspaceSummariesSubject = listenWorkspaceSummaries();

    await addUsersToWorkspace(workspaceIds[0], [], [testUsers[0].email]);
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 1))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId]);
    expect(workspaceSummaries.docs[0].invitedUserEmails).toEqual([testUsers[0].email]);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual([workspaceOwnerId]);
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toEqual([testUsers[0].email]);
  });

  it("Subject properly returns workspace summaries, when the current user accepts a workspace invitation", async () => {
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await addUsersToWorkspace(workspaceIds[0], [], [testUsers[0].email]);
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) => ws.docs.length == 1 && ws.docs[0].invitedUserEmails.includes(testUsers[0].email)
        )
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await acceptWorkspaceInvitation(workspaceIds[0]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
      )
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
    expect(workspaceSummaries.docs[0].invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
  });

  //TODO Implement when function for leaving the open workspace is finished.
  it.skip("Subject properly returns workspace summaries, when the current user leaves a workspace", async () => {});

  it("Subject properly returns workspace summaries, when the current user is removed and added to the workspace", async () => {
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    // Removing user
    await removeUsersFromWorkspace(workspaceIds[0], [testUsers[0].uid]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );
    // Adding again
    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
      )
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
    expect(workspaceSummaries.docs[0].invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
  });

  it("Subject returns an empty array, when the current user signs out", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();

    await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  it("Subject returns all workspace summaries, when the current user signs out and signs in", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );

    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all workspace summaries, when the current user signs out " +
      "and the different user signs in",
    async () => {
      await signInTestUser(testUsers[0].uid);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid))
      );
      const workspaceSummariesSubject = listenWorkspaceSummaries();
      await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
      let workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(
          filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
        )
      );
      await signOut();
      await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
      workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
      );

      await signInTestUser(workspaceOwnerId);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId))
      );
      workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
      );

      expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
      expect(workspaceSummaries.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns proper updates, when an other user is removed from the workspace", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await addUsersToWorkspace(
      workspaceIds[0],
      testUsers.map((user) => user.uid)
    );
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs[0].userIds.length == allTestUsersIds.length
        )
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await removeUsersFromWorkspace(workspaceIds[0], [testUsers[0].uid]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs[0].userIds.length == allTestUsersIds.length - 1
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual(
      allTestUsersIds.filter((uid) => uid != testUsers[0].uid)
    );
    expect(workspaceSummaries.docs[0].invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      allTestUsersIds.filter((uid) => uid != testUsers[0].uid)
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
  });

  it("Subject returns proper updates, when an other user is added to the workspace", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await addUsersToWorkspace(
      workspaceIds[0],
      testUsers.slice(1).map((user) => user.uid)
    );
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs[0].userIds.length == allTestUsersIds.length - 1
        )
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs[0].userIds.length == allTestUsersIds.length
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual(allTestUsersIds);
    expect(workspaceSummaries.docs[0].invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(allTestUsersIds);
    expect(workspaceSummaries.updates[0].doc.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
  });

  it("Subject returns proper updates, when a workspace changes title", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    setOpenWorkspaceId(workspaceSummaries.docs[0].id);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceSummaries.docs[0].id)
      )
    );
    const newTitle = "changed " + workspaceSummaries.docs[0].title;
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime.toMillis();

    await changeWorkspaceTitle(newTitle);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == workspaceIds.length && ws.docs[0].title == newTitle)
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].title).toEqual(newTitle);
    expect(workspaceSummaries.docs[0].modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.title).toEqual(newTitle);
    expect(workspaceSummaries.updates[0].doc.modificationTime.toMillis()).toBeGreaterThan(
      oldModificationTime
    );
  });

  //TODO Implement when function for restoring workspace from recycle bin is implemented
  it("Subject returns proper updates, when a workspace is moved to the recycle bin", async () => {});

  //TODO implement this test after implementing labels api
  it.skip("Subject returns no updates, when a workspace modifies a label", async () => {});
  //TODO implement this test after implementing columns api
  it.skip("Subject returns no updates, when a workspace modifies a column", async () => {});
  //TODO implement this test after implementing tasks api
  it.skip("Subject returns no updates, when a workspace has a new task created", async () => {});
  //TODO implement this test after implementing tasks api
  it.skip("Subject returns no updates, when a workspace has a task modified", async () => {});

  it("After an error and function re-call, the subject returns all workspace summaries.", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    if (!_listenWorkspaceSummariesExportedForTesting)
      throw new Error("listenWorkspaceSummaries.api module didn't export functions for testing.");

    _listenWorkspaceSummariesExportedForTesting.setSubjectError();
    await expect(firstValueFrom(workspaceSummariesSubject)).toReject();
    const workspaceSummaries = await firstValueFrom(
      listenWorkspaceSummaries().pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  //TODO
  it.skip("The subject returns all workspace summaries, when the cache is empty", async () => {});

  //TODO
  it.skip(
    "The subject returns all workspace summaries, " +
      "when the cache is partially synchronized with the firestore (stale)",
    async () => {}
  );

  //TODO
  it.skip(
    "The subject returns all workspace summaries, " +
      "when the cache is fully synchronized with the firestore (up to date)",
    async () => {}
  );
});
