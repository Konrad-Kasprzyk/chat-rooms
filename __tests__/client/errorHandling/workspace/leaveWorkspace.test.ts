import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of leaving a workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user does not belong to the provided workspace.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUserId)));

    await expect(leaveWorkspace("foo")).rejects.toThrow(
      "The user does not belong to the workspace with id foo"
    );
  });
});
