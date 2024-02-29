import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_TEST_TIMEOUT from "__tests__/constants/longTestTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import compareNewestWorkspaceHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestWorkspaceHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import createWorkspace from "client/api/workspace/createWorkspace.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test client api creating a workspace.", () => {
  const workspaceTitle = "First project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;
  let testUserId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates and signs in the test user.
   */
  beforeEach(async () => {
    testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
  });

  it("Creates a workspace without providing a description and a URL.", async () => {
    const workspaceId = await createWorkspace(workspaceTitle);

    const userDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
    expect(userDTO.workspaceIds).toEqual([workspaceId]);
    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toContain(workspaceId);
    await checkNewlyCreatedWorkspace(workspaceId, workspaceTitle, "", workspaceId);
    await compareNewestWorkspaceHistoryRecord(workspaceId, {
      action: "creationTime",
      userId: testUserId,
      date: userDTO.modificationTime.toDate(),
      oldValue: null,
      value: userDTO.modificationTime.toDate(),
    });
  });

  it("Creates a workspace without providing a description.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createWorkspace(workspaceTitle, "", workspaceUrl);

    const userDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
    expect(userDTO.workspaceIds).toEqual([workspaceId]);
    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toContain(workspaceId);
    await checkNewlyCreatedWorkspace(workspaceId, workspaceTitle, "", workspaceUrl);
    await compareNewestWorkspaceHistoryRecord(workspaceId, {
      action: "creationTime",
      userId: testUserId,
      date: userDTO.modificationTime.toDate(),
      oldValue: null,
      value: userDTO.modificationTime.toDate(),
    });
  });

  it("Creates a workspace without providing a URL.", async () => {
    const workspaceId = await createWorkspace(workspaceTitle, workspaceDescription);

    const userDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
    expect(userDTO.workspaceIds).toEqual([workspaceId]);
    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toContain(workspaceId);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceId
    );
    await compareNewestWorkspaceHistoryRecord(workspaceId, {
      action: "creationTime",
      userId: testUserId,
      date: userDTO.modificationTime.toDate(),
      oldValue: null,
      value: userDTO.modificationTime.toDate(),
    });
  });

  it("Creates a workspace with a provided title, description and URL.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createWorkspace(workspaceTitle, workspaceDescription, workspaceUrl);

    const userDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
    expect(userDTO.workspaceIds).toEqual([workspaceId]);
    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toContain(workspaceId);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceUrl
    );
    await compareNewestWorkspaceHistoryRecord(workspaceId, {
      action: "creationTime",
      userId: testUserId,
      date: userDTO.modificationTime.toDate(),
      oldValue: null,
      value: userDTO.modificationTime.toDate(),
    });
  });

  it(
    "Properly creates a workspace when many simultaneous requests are made with the same URL.",
    async () => {
      const workspaceUrl = uuidv4();
      const promises = [];
      const workspaceCreationAttempts = 5;
      let rejectedWorkspaceCreationAttempts = 0;
      let workspaceId = "";

      for (let i = 0; i < workspaceCreationAttempts; i++)
        promises.push(createWorkspace(workspaceTitle, workspaceDescription, workspaceUrl));
      const responses = await Promise.allSettled(promises);
      for (const res of responses) {
        if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
        else workspaceId = res.value;
      }

      expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
      const userDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
      expect(userDTO.workspaceIds).toEqual([workspaceId]);
      const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
      expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toContain(workspaceId);
      await checkNewlyCreatedWorkspace(
        workspaceId,
        workspaceTitle,
        workspaceDescription,
        workspaceUrl
      );
      await compareNewestWorkspaceHistoryRecord(workspaceId, {
        action: "creationTime",
        userId: testUserId,
        date: userDTO.modificationTime.toDate(),
        oldValue: null,
        value: userDTO.modificationTime.toDate(),
      });
    },
    LONG_TEST_TIMEOUT
  );
});
