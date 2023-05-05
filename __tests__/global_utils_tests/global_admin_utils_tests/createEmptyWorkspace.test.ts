import path from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import TestUsersAndSubcollections from "../../../global/models/utils_models/testUsersAndSubcollections.model";
import { createEmptyWorkspace } from "../../../global/utils/admin_utils/workspace";
import getTestUsers, {
  getRegisteredOnlyUser,
  signInTestUser,
} from "../../../global/utils/test_utils/getTestUsers";
import testEmptyWorkspace from "../../utils/testEmptyWorkspace";

describe("Test pack", () => {
  const testsDescription = "Test admin utils creating an empty workspace";
  let uid = "";
  const workspaceTitle = "First project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;
  let testUsers: TestUsersAndSubcollections;
  beforeAll(async () => {
    testUsers = await getTestUsers();
    ({ uid } = getRegisteredOnlyUser(testUsers));
  });
  afterAll(async () => {
    await auth.signOut();
  });

  describe(testsDescription, () => {
    it("Throws an error when user document is not found.", async () => {
      const workspaceUrl = uuidv4();

      await expect(
        createEmptyWorkspace(uid, workspaceUrl, workspaceTitle, workspaceDescription)
      ).toReject();

      const workspacesSnap = await adminDb
        .collection(COLLECTIONS.workspaces)
        .where("url", "==", workspaceUrl)
        .get();
      expect(workspacesSnap.size).toEqual(0);
    });
  });

  describe(testsDescription, () => {
    beforeAll(async () => {
      ({ uid } = await signInTestUser(testUsers));
    });

    it("Properly creates an empty workspace.", async () => {
      const workspaceUrl = uuidv4();

      const workspaceId = await createEmptyWorkspace(
        uid,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );

      await testEmptyWorkspace(
        uid,
        workspaceId,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
    });

    it("Throws error when the workspace url is already taken.", async () => {
      const workspaceUrl = uuidv4();

      const workspaceId = await createEmptyWorkspace(
        uid,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
      await expect(
        createEmptyWorkspace(uid, workspaceUrl, workspaceTitle, workspaceDescription)
      ).toReject();

      expect(workspaceId).toBeString();
      const workspacesSnap = await adminDb
        .collection(COLLECTIONS.workspaces)
        .where("url", "==", workspaceUrl)
        .get();
      expect(workspacesSnap.size).toEqual(1);
    });

    it("Properly creates an empty workspace when many simultaneous requests are made.", async () => {
      const workspaceUrl = uuidv4();
      const promises = [];
      const workspaceCreationAttempts = 10;
      let rejectedWorkspaceCreationAttempts = 0;
      let workspaceId = "";

      for (let i = 0; i < workspaceCreationAttempts; i++)
        promises.push(
          createEmptyWorkspace(uid, workspaceUrl, workspaceTitle, workspaceDescription)
        );
      const responses = await Promise.allSettled(promises);
      for (const res of responses) {
        if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
        else workspaceId = res.value;
      }

      expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
      await testEmptyWorkspace(
        uid,
        workspaceId,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
    });
  });
});
