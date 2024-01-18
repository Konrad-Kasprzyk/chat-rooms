import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of deleting a workspace.", () => {
  let workspaceId: string;

  /**
   * Creates and opens the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("The workspace document not found.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("The workspace document with id foo not found.");
  });

  it("The workspace is not in the recycle bin.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is not in the recycle bin.`
    );
  });

  it("The workspace does not have the deleted flag set.", async () => {
    await moveWorkspaceToRecycleBin();

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} does not have the deleted flag set.`
    );
  });
});
