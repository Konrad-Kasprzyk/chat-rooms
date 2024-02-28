import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import validateUser from "__tests__/utils/modelValidators/clientModelValidators/validateUser.util";
import validateUserDetails from "__tests__/utils/modelValidators/clientModelValidators/validateUserDetails.util";
import validateWorkspace from "__tests__/utils/modelValidators/clientModelValidators/validateWorkspace.util";
import validateWorkspaceSummary from "__tests__/utils/modelValidators/clientModelValidators/validateWorkspaceSummary.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import mapUserDTO from "client/utils/mappers/mapUserDTO.util";
import mapUserDetailsDTO from "client/utils/mappers/mapUserDetailsDTO.util";
import mapWorkspaceDTO from "client/utils/mappers/mapWorkspaceDTO.util";
import mapWorkspaceSummaryDTO from "client/utils/mappers/mapWorkspaceSummaryDTO.util";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test DTO mappers", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Test User DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    const userDTO = (await adminCollections.users.doc(testUser.uid).get()).data()!;

    const user = mapUserDTO(userDTO);

    const dateAfterMapping = new Date();
    expect(user.modificationTime).toEqual(userDTO.modificationTime.toDate());
    expect(user.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(user.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(user.hasOfflineChanges).toBeFalse();
    validateUser(user);
  });

  it("Test UserDetails DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    const userDetailsDTO = (await adminCollections.userDetails.doc(testUser.uid).get()).data()!;

    const userDetails = mapUserDetailsDTO(userDetailsDTO);

    const dateAfterMapping = new Date();
    expect(userDetails.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(userDetails.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(userDetails.hasOfflineChanges).toBeFalse();
    validateUserDetails(userDetails);
  });

  it("Test Workspace DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;

    const workspace = mapWorkspaceDTO(workspaceDTO);

    const dateAfterMapping = new Date();
    expect(workspace.users).toBeArrayOfSize(0);
    expect(workspace.modificationTime).toEqual(workspaceDTO.modificationTime.toDate());
    expect(workspace.creationTime).toEqual(workspaceDTO.creationTime.toDate());
    expect(workspace.placingInBinTime).toBeNull();
    expect(workspace.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(workspace.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(workspace.hasOfflineChanges).toBeFalse();
    validateWorkspace(workspace);
  });

  it("Test WorkspaceSummary DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;

    const workspaceSummary = mapWorkspaceSummaryDTO(workspaceSummaryDTO);

    const dateAfterMapping = new Date();
    expect(workspaceSummary.modificationTime).toEqual(
      workspaceSummaryDTO.modificationTime.toDate()
    );
    expect(workspaceSummary.creationTime).toEqual(workspaceSummaryDTO.creationTime.toDate());
    expect(workspaceSummary.placingInBinTime).toBeNull();
    expect(workspaceSummary.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(workspaceSummary.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(workspaceSummary.hasOfflineChanges).toBeFalse();
    validateWorkspaceSummary(workspaceSummary);
  });
});
