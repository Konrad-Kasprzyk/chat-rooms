import IDB_NAME from "client/constants/indexedDBName.constant";
import IDB_VERSION from "client/constants/indexedDBVersion.constant";
import IDBSchema from "client/interfaces/indexedDBSchema.interface";
import { IDBPDatabase, deleteDB, openDB } from "idb";

let idb: IDBPDatabase<IDBSchema> | null = null;
let idbError: boolean = false;

/**
 * Opens the indexedDB database and returns the open connection object. Returns the same database
 * connection if the database is open.
 * @returns IndexedDB database connection object or null if the database could not be opened.
 */
export default async function getIDB(): Promise<IDBPDatabase<IDBSchema> | null> {
  if (!idb && !idbError) {
    try {
      await openIDB();
    } catch (err: any) {
      idbError = true;
      idb = null;
    }
  }
  return idb;
}

/**
 * Closes the indexedDB database. Sets the open connection to null.
 */
export function closeIDB() {
  if (!idb) return;
  idb.close();
  idb = null;
}

/**
 * Clears all object stores. Does not modify the open connection.
 */
export async function clearIDB() {
  if (!idb) return;
  const tx = idb.transaction(idb.objectStoreNames, "readwrite");
  const promises = [];
  for (const storeName of idb.objectStoreNames) {
    promises.push(tx.objectStore(storeName).clear());
  }
  await Promise.all([...promises, tx.done]);
}

/**
 * Deletes the indexedDB database. Sets the open connection to null.
 */
export async function deleteIDB() {
  await deleteDB(IDB_NAME);
  idb = null;
}

/**
 * Opens or creates the indexedDB database if it does not exist.
 */
async function openIDB(): Promise<void> {
  idb = await openDB<IDBSchema>(IDB_NAME, IDB_VERSION, {
    /**
     * The upgrade event is called if there is no database or one exists with an older version.
     * In case of version upgrade, delete all old object stores with their data.
     */
    upgrade: (db) => {
      for (const storeName of db.objectStoreNames) {
        db.deleteObjectStore(storeName);
      }

      const tasksStore = db.createObjectStore("tasks", { keyPath: "id" });
      tasksStore.createIndex("index", ["workspaceId", "columnId", "firstIndex", "secondIndex"], {
        unique: false,
      });
      tasksStore.createIndex("modificationTime", ["workspaceId", "columnId", "modificationTime"], {
        unique: false,
      });
      tasksStore.createIndex("columnChangeTime", ["workspaceId", "columnId", "columnChangeTime"], {
        unique: false,
      });
      tasksStore.createIndex("creationTime", ["workspaceId", "columnId", "creationTime"], {
        unique: false,
      });
      tasksStore.createIndex("placingInBinTime", ["workspaceId", "columnId", "placingInBinTime"], {
        unique: false,
      });
      const goalsStore = db.createObjectStore("goals", { keyPath: "id" });
      goalsStore.createIndex("index", ["workspaceId", "columnId", "firstIndex", "secondIndex"], {
        unique: false,
      });
      goalsStore.createIndex("modificationTime", ["workspaceId", "columnId", "modificationTime"], {
        unique: false,
      });
      goalsStore.createIndex("deadline", ["workspaceId", "columnId", "deadline"], {
        unique: false,
      });
      goalsStore.createIndex("creationTime", ["workspaceId", "columnId", "creationTime"], {
        unique: false,
      });
      goalsStore.createIndex("placingInBinTime", ["workspaceId", "columnId", "placingInBinTime"], {
        unique: false,
      });
      db.createObjectStore("goalArchives", { keyPath: "id" });
      db.createObjectStore("taskArchives", { keyPath: "id" });
      db.createObjectStore("columnHistories", { keyPath: "id" });
      db.createObjectStore("goalHistories", { keyPath: "id" });
      db.createObjectStore("labelHistories", { keyPath: "id" });
      db.createObjectStore("taskHistories", { keyPath: "id" });
      db.createObjectStore("userHistories", { keyPath: "id" });
      db.createObjectStore("workspaceHistories", { keyPath: "id" });
    },
    blocking: () => {
      closeIDB();
    },
    terminated: () => {
      idbError = true;
      idb = null;
    },
  });

  /**
   * Clears all object stores. This prevents inconsistent state between object stores. The 'abort'
   * event is fired when the transaction is aborted. If the 'error' event is fired inside the
   * transaction, it will result in the 'abort' event being received on the transaction and then
   * on the database connection. It bubbles up.
   */
  idb.onabort = (event: Event) => {
    clearIDB();
  };
}
