import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import rejectWorkspaceInvitation from "clientApi/user/rejectWorkspaceInvitation.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of rejecting a workspace invitation.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user document not found.", async () => {
    expect.assertions(1);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((u) => u == null)));

    await expect(rejectWorkspaceInvitation("foo")).rejects.toThrow(
      "The user is not invited to the workspace with id foo"
    );
  });

  it("The user is not invited to the workspace.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(user.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((u) => u?.id == user.uid)));

    await expect(rejectWorkspaceInvitation("foo")).rejects.toThrow(
      "The user is not invited to the workspace with id foo"
    );
  });
});
