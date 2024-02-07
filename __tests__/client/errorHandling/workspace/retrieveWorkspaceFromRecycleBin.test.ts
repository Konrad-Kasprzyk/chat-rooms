import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import retrieveWorkspaceFromRecycleBin from "client/api/workspace/retrieveWorkspaceFromRecycleBin.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of retrieving a workspace from the recycle bin.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user does not belong to the workspace.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(user.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((u) => u?.id == user.uid)));

    await expect(retrieveWorkspaceFromRecycleBin("foo")).rejects.toThrow(
      "The user does not belong to the workspace with id foo"
    );
  });
});
