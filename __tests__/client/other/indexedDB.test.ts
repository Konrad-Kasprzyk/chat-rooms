import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import IDB_NAME from "client/constants/indexedDBName.constant";
import IDB_VERSION from "client/constants/indexedDBVersion.constant";
import getIDB, { deleteIDB } from "client/utils/indexedDB/indexedDB.utils";
import { openDB } from "idb";

describe("Test IndexedDB behavior (creating, aborting etc.)", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  afterEach(async () => {
    await deleteIDB();
  });

  it("Test if IDB version upgrade is not blocked.", async () => {
    const oldIdb = await getIDB();
    if (!oldIdb) throw new Error("Could not open indexedDB.");

    const upgradedIdb = await openDB(IDB_NAME, IDB_VERSION + 1, {
      upgrade: () => {},
      blocking: () => {
        upgradedIdb.close();
      },
    });

    expect(upgradedIdb.version).toEqual(IDB_VERSION + 1);
  });
});
