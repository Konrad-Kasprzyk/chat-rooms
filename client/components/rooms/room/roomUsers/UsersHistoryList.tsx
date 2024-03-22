import {
  getHistoryListenerState,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenUsersHistoryRecords from "client/api/history/usersHistory/listenUsersHistoryRecords.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import ArchivedUser from "common/types/history/archivedUser.type";
import { useEffect, useState } from "react";
import UsersHistoryRecord from "./UsersHistoryRecord";

export default function UsersHistoryList() {
  const [historyRecords, setHistoryRecords] = useState<UsersHistory["history"]>([]);

  /**
   * Set history listener filters only if they are not already set. This prevents overriding actual
   * history listener filters, which could cause loading additional unwanted history records chunk
   * or cancel loading history records chunk.
   */
  useEffect(() => {
    const usersHistoryFilters = getHistoryListenerState()?.["UsersHistory"];
    if (!usersHistoryFilters)
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
  }, []);

  useEffect(() => {
    const usersHistoryRecordsSubscription = listenUsersHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        setHistoryRecords(nextHistoryRecords);
      }
    );
    return () => usersHistoryRecordsSubscription.unsubscribe();
  }, []);

  return (
    <ul
      className={`list-group list-group-flush overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}
    >
      {historyRecords.map((historyRecord) => {
        let oldValue: string | null;
        let value: string | null;
        if (historyRecord.action == "users" || historyRecord.action == "userRemovedFromWorkspace") {
          oldValue =
            historyRecord.oldValue === null
              ? null
              : (historyRecord.oldValue as ArchivedUser).username;
          value =
            historyRecord.value === null ? null : (historyRecord.value as ArchivedUser).username;
        } else if (historyRecord.action == "allInvitationsCancel") {
          oldValue = null;
          value = null;
        } else {
          oldValue = historyRecord.oldValue as string | null;
          value = historyRecord.value as string | null;
        }
        return (
          <UsersHistoryRecord
            key={historyRecord.id}
            action={historyRecord.action}
            actionMakerUsername={historyRecord.user ? historyRecord.user.username : ""}
            dateMillis={historyRecord.date.getTime()}
            oldValue={oldValue}
            value={value}
          />
        );
      })}
    </ul>
  );
}
