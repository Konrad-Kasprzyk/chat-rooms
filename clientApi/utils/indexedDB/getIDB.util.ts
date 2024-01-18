import { IDBPDatabase, openDB } from "idb";

let idb: IDBPDatabase<unknown> | null = null;
let isFirstIDBOpen: boolean = true;

/**
 * Manages IndexedDB connection. Once the connection is closed, it remains closed.
 * @returns IndexedDB database or null when the connection cannot be opened or has been closed.
 */
export default async function getIDB(): Promise<IDBPDatabase<any> | null> {
  if (isFirstIDBOpen) {
    await openIDB();
    isFirstIDBOpen = false;
  }
  return idb;
}

/**
 * Works properly when called multiple times, even when opening connection failed.
 */
async function openIDB(): Promise<void> {
  // TODO make name nad version constant
  idb = await openDB("normkeeperIDB", 1, {
    upgrade: (db, oldVersion, newVersion, transaction, event) => {
      // Database already exists, but with old version
      if (oldVersion !== 0 && newVersion && oldVersion < newVersion) {
        for (const storeName of db.objectStoreNames) {
          db.deleteObjectStore(storeName);
        }
      }
      //TODO create model stores
      //TODO create model indexes
      //TODO create model filters stores
      db.createObjectStore("first store", { keyPath: "id" });
    },
    blocking: () => {
      if (!idb) return;
      idb.close();
      idb = null;
    },
    terminated: () => {
      idb = null;
    },
  }).catch(() => {
    return null;
  });
  if (!idb) return;
  // Clear object stores used by aborted transaction.
  idb.onabort = async (event: Event) => {
    if (!idb) return;
    const abortedTransaction = event.target as IDBTransaction;
    const tx = idb.transaction(abortedTransaction.objectStoreNames, "readwrite");
    const promises = [];
    for (const storeName of abortedTransaction.objectStoreNames) {
      promises.push(tx.objectStore(storeName).clear());
    }
    await Promise.all([...promises, tx.done]);
  };
}
