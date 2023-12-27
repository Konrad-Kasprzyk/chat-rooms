import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDocs/checkDeletedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import markCurrentUserDeleted from "client_api/user/markCurrentUserDeleted.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test marking the current user deleted.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  });

  it("Marks the current user deleted.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );

    markCurrentUserDeleted();

    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails == null))
    );
    await checkDeletedUser(testUser.uid);
  });
});
