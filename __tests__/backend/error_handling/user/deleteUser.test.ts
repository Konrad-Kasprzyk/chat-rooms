import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import adminCollections from "backend/db/adminCollections.firebase";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import { FieldValue, Timestamp as adminTimestamp } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

describe("Test errors of deleting a user.", () => {
  let userId: string;
  const deletionTime = adminTimestamp.fromMillis(
    new Date().getTime() - DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );

  beforeAll(async () => {
    await globalBeforeAll();
    userId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  }, BEFORE_ALL_TIMEOUT);

  beforeEach(async () => {
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: deletionTime,
    });
  });

  it("The user does not have the deleted flag set.", async () => {
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with id ${userId} does not have the deleted flag set.`
    );
  });

  it(
    "The user has the deleted flag set, but does not have a time " +
      "when the deleted flag was set.",
    async () => {
      await adminCollections.users.doc(userId).update({
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isDeleted: true,
        deletionTime: null,
      });

      const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
        userId,
      });

      expect(res.ok).toBeFalse();
      expect(res.status).toEqual(500);
      expect(await res.text()).toEqual(
        `The user with id ${userId} has the deleted flag set, but does not have a time ` +
          `when the deleted flag was set.`
      );
    }
  );

  it("The user does not have the deleted flag set long enough.", async () => {
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with id ${userId} does not have the deleted flag set long enough.`
    );
  });
});
