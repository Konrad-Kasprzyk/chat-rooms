import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import auth from "client/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

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
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 4; i++) workspaceIds.push(await createTestWorkspace(filename));
    testUsers.sort((u1, u2) => {
      if (u1.uid < u2.uid) return -1;
      if (u1.uid === u2.uid) return 0;
      return 1;
    });
    workspaceIds.sort();
    allTestUsersIds = [...testUsers.map((user) => user.uid), workspaceOwnerId];
    allTestUsersIds.sort();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspaces owner. Ensures that the workspace owner is the only member of each workspace.
   * Removes all other users from the test workspaces and cancels all invitations to them.
   * Checks that each test workspace is not in the recycle bin, marked as removed, or removed.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid != workspaceOwnerId)
      await signInTestUser(workspaceOwnerId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    const testWorkspacesSnap = await adminCollections.workspaces
      .where("id", "in", workspaceIds)
      .get();
    expect(testWorkspacesSnap.size).toEqual(workspaceIds.length);
    const testWorkspaces = testWorkspacesSnap.docs.map((doc) => doc.data());
    const promises = [];
    for (const workspace of testWorkspaces) {
      expect(workspace!.isDeleted).toBeFalse();
      expect(workspace!.isInBin).toBeFalse();
      expect(workspace!.userIds).toContain(workspaceOwnerId);
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
            ws.docs.every((ws) => ws.userIds.length == 1 && ws.invitedUserIds.length == 0)
        )
      )
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

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
      const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
        expect(ws.modificationTime).toBeAfter(oldModificationTime);
      }
      expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
      for (const update of workspaceSummaries.updates) {
        expect(update.type).toEqual("modified");
        expect(update.doc.userIds).toEqual(allTestUsersIds);
        expect(update.doc.modificationTime).toBeAfter(oldModificationTime);
      }
    }
  );

  it(
    "Subject returns all workspace summaries, when many other users belong to workspaces " +
      "and the subject is retrieved again from the function.",
    async () => {
      let workspaceSummaries = await firstValueFrom(listenWorkspaceSummaries());
      const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
        expect(ws.modificationTime).toBeAfter(oldModificationTime);
      }
      expect(workspaceSummaries.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns all workspace summaries, when many other users are invited to workspaces", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
            ws.docs.every((ws) => ws.invitedUserIds.length == testUsers.length)
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    for (const ws of workspaceSummaries.docs) {
      expect(ws.userIds).toEqual([workspaceOwnerId]);
      expect(ws.invitedUserIds).toEqual(testUsers.map((user) => user.uid).sort());
      expect(ws.modificationTime).toBeAfter(oldModificationTime);
    }
    expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
    for (const update of workspaceSummaries.updates) {
      expect(update.type).toEqual("modified");
      expect(update.doc.userIds).toEqual([workspaceOwnerId]);
      expect(update.doc.invitedUserIds).toEqual(testUsers.map((user) => user.uid).sort());
      expect(update.doc.modificationTime).toBeAfter(oldModificationTime);
    }
  });

  it("Subject returns all workspace summaries, when the single user is invited to workspaces", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

    await Promise.all(
      workspaceIds.map((workspaceId) => addUsersToWorkspace(workspaceId, [], [testUsers[0].email]))
    );
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs.every((ws) => ws.invitedUserIds.length == 1)
        )
      )
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    for (const ws of workspaceSummaries.docs) {
      expect(ws.userIds).toEqual([workspaceOwnerId]);
      expect(ws.invitedUserIds).toEqual([testUsers[0].uid]);
      expect(ws.modificationTime).toBeAfter(oldModificationTime);
    }
    expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
    for (const update of workspaceSummaries.updates) {
      expect(update.type).toEqual("modified");
      expect(update.doc.userIds).toEqual([workspaceOwnerId]);
      expect(update.doc.invitedUserIds).toEqual([testUsers[0].uid]);
      expect(update.doc.modificationTime).toBeAfter(oldModificationTime);
    }
  });

  it(
    "Subject returns all workspace summaries, when the current user belongs to some workspaces " +
      "and is invited to some workspaces",
    async () => {
      const workspaceSummariesSubject = listenWorkspaceSummaries();
      await signInTestUser(testUsers[0].uid);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid))
      );

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
        expect(ws.invitedUserIds).toBeArrayOfSize(0);
      }
      for (const ws of workspaceSummaries.docs.slice(2)) {
        expect(ws.userIds).toEqual([workspaceOwnerId]);
        expect(ws.invitedUserIds).toEqual([testUsers[0].uid]);
      }
      expect(workspaceSummaries.updates.length).toBeGreaterThan(0);
      for (const update of workspaceSummaries.updates) {
        expect(update.type).toEqual("added");
        if (workspaceIds.slice(0, 2).includes(update.doc.id)) {
          expect(update.doc.userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
          expect(update.doc.invitedUserIds).toBeArrayOfSize(0);
        } else {
          expect(update.doc.userIds).toEqual([workspaceOwnerId]);
          expect(update.doc.invitedUserIds).toEqual([testUsers[0].uid]);
        }
      }
    }
  );

  it("Subject returns a single workspace summary, when the current user belongs to a single workspace.", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));

    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 1))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
    expect(workspaceSummaries.docs[0].invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toBeArrayOfSize(0);
  });

  it("Subject returns a single workspace summary, when the current user is only invited to a one workspace", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));

    await addUsersToWorkspace(workspaceIds[0], [], [testUsers[0].email]);
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 1))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId]);
    expect(workspaceSummaries.docs[0].invitedUserIds).toEqual([testUsers[0].uid]);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual([workspaceOwnerId]);
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toEqual([testUsers[0].uid]);
  });

  it("Subject properly returns workspace summaries, when the current user accepts a workspace invitation", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    await addUsersToWorkspace(workspaceIds[0], [], [testUsers[0].email]);
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].invitedUserIds.includes(testUsers[0].uid))
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

    await acceptWorkspaceInvitation(workspaceIds[0]);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
      )
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.docs[0].userIds).toEqual([workspaceOwnerId, testUsers[0].uid].sort());
    expect(workspaceSummaries.docs[0].invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime).toBeAfter(oldModificationTime);
  });

  //TODO Implement when function for leaving the open workspace is finished.
  it.skip("Subject properly returns workspace summaries, when the current user leaves a workspace", async () => {});

  it("Subject properly returns workspace summaries, when the current user is removed and added to the workspace", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signInTestUser(testUsers[0].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid)));
    await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
      )
    );
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
    expect(workspaceSummaries.docs[0].invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      [workspaceOwnerId, testUsers[0].uid].sort()
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Subject returns an empty array, when the current user signs out", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();

    await signOut();
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );

    expect(workspaceSummaries.docs).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates).toBeArrayOfSize(0);
  });

  it("Subject returns all workspace summaries, when the current user signs out and signs in", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await signOut();
    let workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == 0))
    );

    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds);
    expect(workspaceSummaries.updates.every((update) => update.type == "added")).toBeTrue();
  });

  it(
    "Subject returns all workspace summaries, when the current user signs out " +
      "and the different user signs in",
    async () => {
      const workspaceSummariesSubject = listenWorkspaceSummaries();
      await signInTestUser(testUsers[0].uid);
      await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == testUsers[0].uid))
      );
      await addUsersToWorkspace(workspaceIds[0], [testUsers[0].uid]);
      let workspaceSummaries = await firstValueFrom(
        workspaceSummariesSubject.pipe(
          filter((ws) => ws.docs.length == 1 && ws.docs[0].userIds.includes(testUsers[0].uid))
        )
      );
      await signOut();
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
      expect(workspaceSummaries.updates.every((update) => update.type == "added")).toBeTrue();
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
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
    expect(workspaceSummaries.docs[0].invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(
      allTestUsersIds.filter((uid) => uid != testUsers[0].uid)
    );
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime).toBeAfter(oldModificationTime);
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
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

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
    expect(workspaceSummaries.docs[0].invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.docs[0].modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    expect(workspaceSummaries.updates[0].doc.userIds).toEqual(allTestUsersIds);
    expect(workspaceSummaries.updates[0].doc.invitedUserIds).toBeArrayOfSize(0);
    expect(workspaceSummaries.updates[0].doc.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Subject returns proper updates, when a workspace changes title", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    let workspaceSummaries = await firstValueFrom(workspaceSummariesSubject);
    const workspaceSummaryToUpdateId = workspaceSummaries.docs[0].id;
    setOpenWorkspaceId(workspaceSummaryToUpdateId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceSummaryToUpdateId))
    );
    const newTitle = uuidv4();
    const oldModificationTime = workspaceSummaries.docs[0].modificationTime;

    await changeWorkspaceTitle(newTitle);
    workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(
        filter(
          (ws) =>
            ws.docs.length == workspaceIds.length &&
            ws.docs.some((workspaceSummary) => workspaceSummary.title == newTitle)
        )
      )
    );

    const updatedWorkspaceSummary = workspaceSummaries.docs.find(
      (workspaceSummary) => workspaceSummary.title == newTitle
    );
    expect(updatedWorkspaceSummary!.id).toEqual(workspaceSummaryToUpdateId);
    expect(updatedWorkspaceSummary!.title).toEqual(newTitle);
    expect(updatedWorkspaceSummary!.modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("modified");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceSummaryToUpdateId);
    expect(workspaceSummaries.updates[0].doc.title).toEqual(newTitle);
    expect(workspaceSummaries.updates[0].doc.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Subject returns proper updates, when a workspace is marked as deleted", async () => {
    const workspaceSummariesSubject = listenWorkspaceSummaries();
    await Promise.all([
      adminCollections.workspaces
        .doc(workspaceIds[0])
        .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() }),
      adminCollections.workspaceSummaries
        .doc(workspaceIds[0])
        .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() }),
    ]);

    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesSubject.pipe(filter((ws) => ws.docs.length == workspaceIds.length - 1))
    );

    expect(workspaceSummaries.docs.map((ws) => ws.id)).toEqual(workspaceIds.slice(1));
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("removed");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceIds[0]);
    await Promise.all([
      adminCollections.workspaces
        .doc(workspaceIds[0])
        .update({ isDeleted: false, modificationTime: FieldValue.serverTimestamp() }),
      adminCollections.workspaceSummaries
        .doc(workspaceIds[0])
        .update({ isDeleted: false, modificationTime: FieldValue.serverTimestamp() }),
    ]);
  });

  //TODO Implement when function for restoring workspace from recycle bin is implemented
  it.skip("Subject returns proper updates, when a workspace is moved to the recycle bin", async () => {});
});
