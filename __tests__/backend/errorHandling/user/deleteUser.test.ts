import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";

describe("Test errors of deleting a user.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user details document not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).delete();

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The user details document with id ${testUserId} not found.`);
  });

  it("The user document not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.users.doc(testUserId).delete();

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The user document with id ${testUserId} not found.`);
  });

  it("The user does not have the deleted flag set.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${testUserId} does not have the deleted flag set.`
    );
  });

  it("The user is marked as deleted, but does not have the deletion time.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.users.doc(testUserId).update({
      isDeleted: true,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `The user with id ${testUserId} is marked as deleted, but does not have the deletion time.`
    );
  });

  it("The user is not marked as deleted long enough.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.users.doc(testUserId).update({
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp(),
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${testUserId} is not marked as deleted long enough.`
    );
  });
});
