import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import addBotToWorkspace from "clientApi/workspace/addBotToWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of adding a bot to the open workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The bot id does not belong to the actual signed in user's linked ids.", async () => {
    expect.assertions(1);

    await expect(addBotToWorkspace("foo")).rejects.toThrow(
      "The provided bot id foo does not belong to the actual signed in user's linked ids."
    );
  });

  it("The open workspace document not found.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const botId = userDetails!.linkedUserDocumentIds.find((botId) => botId != testUserId)!;

    await expect(addBotToWorkspace(botId)).rejects.toThrow(
      "The open workspace document not found."
    );
  });

  it("The bot already belongs to the open workspace.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const botId = userDetails!.linkedUserDocumentIds.find((botId) => botId != testUserId)!;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await addBotToWorkspace(botId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );

    await expect(addBotToWorkspace(botId)).rejects.toThrow(
      `The bot with id ${botId} already belongs to the open workspace`
    );
  });
});
