import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testChatHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testChatHistoryNotFoundError.util";
import testUserDoesNotBelongToWorkspaceError from "__tests__/utils/commonTests/backendErrors/testUserDoesNotBelongToWorkspaceError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testWorkspaceHasDeletedFlagError.util";
import testWorkspaceInRecycleBinError from "__tests__/utils/commonTests/backendErrors/testWorkspaceInRecycleBinError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

describe("Test errors of sending a new message.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The message is an empty string.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.sendMessage, {
      workspaceId: "foo",
      message: "",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("message is not a non-empty string.");
  });

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });

  it("The chat history document not found.", async () => {
    await testChatHistoryNotFoundError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });

  it("The workspace is in the recycle bin.", async () => {
    await testWorkspaceInRecycleBinError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });

  it("The workspace has the deleted flag set.", async () => {
    await testWorkspaceHasDeletedFlagError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });

  it("The user does not belong to the workspace.", async () => {
    await testUserDoesNotBelongToWorkspaceError(CLIENT_API_URLS.workspace.sendMessage, {
      message: "foo",
    });
  });
});
