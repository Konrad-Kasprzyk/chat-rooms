import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import sendMessage from "client/api/workspace/sendMessage.api";
import mapChatHistoryDTO from "client/utils/mappers/historyMappers/mapChatHistoryDTO.util";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test sending a new message.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates and opens the new workspace to test sending message.
   */
  beforeEach(async () => {
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  });

  it("Sends the first message in the chat room.", async () => {
    const message = "foo";
    const beforeSendingMessageTime = new Date();

    await sendMessage(message);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const chatHistoryDTO = (
      await adminCollections.chatHistories.doc(workspace!.newestChatHistoryId).get()
    ).data();

    const chatHistory = mapChatHistoryDTO(chatHistoryDTO!);
    expect(chatHistory.historyRecordsCount).toEqual(1);
    const newestRecord = chatHistory.history[chatHistory.historyRecordsCount - 1];
    expect(newestRecord.id).toEqual(0);
    expect(newestRecord.action).toEqual("message");
    expect(newestRecord.user).toEqual(null);
    expect(newestRecord.userId).toEqual(workspacesOwner.uid);
    expect(newestRecord.date).toBeAfter(beforeSendingMessageTime);
    expect(newestRecord.oldValue).toEqual("");
    expect(newestRecord.value).toEqual(message);
  });

  it("Sends a message in the chat room when other messages have been sent.", async () => {
    await sendMessage("foo");
    await sendMessage("bar");
    const newestMessage = "baz";
    const beforeSendingNewestMessageTime = new Date();

    await sendMessage(newestMessage);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const chatHistoryDTO = (
      await adminCollections.chatHistories.doc(workspace!.newestChatHistoryId).get()
    ).data();

    const chatHistory = mapChatHistoryDTO(chatHistoryDTO!);
    expect(chatHistory.historyRecordsCount).toEqual(3);
    const newestRecord = chatHistory.history[chatHistory.historyRecordsCount - 1];
    expect(newestRecord.id).toEqual(2);
    expect(newestRecord.action).toEqual("message");
    expect(newestRecord.user).toEqual(null);
    expect(newestRecord.userId).toEqual(workspacesOwner.uid);
    expect(newestRecord.date).toBeAfter(beforeSendingNewestMessageTime);
    expect(newestRecord.oldValue).toEqual("");
    expect(newestRecord.value).toEqual(newestMessage);
  });
});
