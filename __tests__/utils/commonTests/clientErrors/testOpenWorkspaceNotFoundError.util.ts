import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import { filter, firstValueFrom } from "rxjs";

/**
 * Tests if the client function throws the appropriate error.
 * Creates the test user and workspace for this single test.
 * @param testFunction Client function to test if it throws the appropriate error.
 */
export default async function testOpenWorkspaceNotFoundError(testFunction: Function) {
  expect.assertions(1);
  setOpenWorkspaceId(null);
  await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

  await expect(testFunction).rejects.toThrow("The open workspace document not found.");
}
