import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

describe("Test errors of marking a user deleted.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user document not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.user.markUserDeleted);

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user document with id ${registeredOnlyUser.uid} not found.`
    );
  });

  it("The user has the deleted flag set already.", async () => {
    const userId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(userId);
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.user.markUserDeleted);

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user with id ${userId} has the deleted flag set already.`
    );
  });
});
