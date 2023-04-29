import path from "path";
import { getCurrentUser } from "../../../client_api/user.api";
import { createEmptyWorkspace } from "../../../client_api/workspace.api";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";
import {
  deleteWorkspaceAndRelatedDocuments,
  getRandomUrl,
} from "../../../global/utils/admin_utils/workspace";
import testEmptyWorkspace from "../../utils/testEmptyWorkspace";

describe("Test pack", () => {
  const testsDescription = "Test client api creating an empty workspace";
  const usedWorkspaceUrls: string[] = [];
  const email = getUniqueEmail();
  const password = getRandomPassword();
  const filename = path.parse(__filename).name;
  const username = "Jeff " + filename;
  let uid = "";
  const workspaceTitle = "First project";
  const workspaceDescription = filename;
  beforeAll(async () => {
    uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
  });
  afterAll(async () => {
    await auth.signOut();
    const promises: Promise<any>[] = [];
    promises.push(deleteRegisteredUsersAndUserDocuments([email]));
    for (const workspaceUrl of usedWorkspaceUrls)
      promises.push(deleteWorkspaceAndRelatedDocuments(workspaceUrl));
    await Promise.all(promises);
  });

  describe(testsDescription, () => {
    it("Throws an error when user document is not found.", async () => {
      const workspaceUrl = getRandomUrl();
      usedWorkspaceUrls.push(workspaceUrl);

      await expect(
        createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription)
      ).toReject()

      const workspacesSnap = await adminDb
        .collection(COLLECTIONS.workspaces)
        .where("url", "==", workspaceUrl)
        .get();
      expect(workspacesSnap.size).toEqual(0);
    });
  });

  describe(testsDescription, () => {
    beforeAll(async () => {
      await createUserModel(uid, email, username);
      while (!getCurrentUser().value) await new Promise((f) => setTimeout(f, 200));
    });

    it("Properly creates an empty workspace.", async () => {
      const workspaceUrl = getRandomUrl();
      usedWorkspaceUrls.push(workspaceUrl);

      const workspaceId = await createEmptyWorkspace(
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
      const workspaceUrl = getRandomUrl();
      usedWorkspaceUrls.push(workspaceUrl);

      const workspaceId = await createEmptyWorkspace(
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      );
      await expect(
        createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription)
      ).toReject();

      expect(workspaceId).toBeString();
      const workspacesSnap = await adminDb
        .collection(COLLECTIONS.workspaces)
        .where("url", "==", workspaceUrl)
        .get();
      expect(workspacesSnap.size).toEqual(1);
    });

    it("Properly creates an empty workspace when many simultaneous requests are made.", async () => {
      const workspaceUrl = getRandomUrl();
      usedWorkspaceUrls.push(workspaceUrl);
      const promises = [];
      const workspaceCreationAttempts = 10;
      let rejectedWorkspaceCreationAttempts = 0;
      let workspaceId = "";

      for (let i = 0; i < workspaceCreationAttempts; i++)
        promises.push(createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription));
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
