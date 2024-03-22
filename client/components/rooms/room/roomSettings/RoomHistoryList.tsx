import listenWorkspaceHistoryRecords from "client/api/history/workspaceHistory/listenWorkspaceHistoryRecords.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import { useLayoutEffect, useState } from "react";
import RoomHistoryRecord from "./RoomHistoryRecord";

export default function RoomHistoryList() {
  const [historyRecords, setHistoryRecords] = useState<WorkspaceHistory["history"]>([]);

  useLayoutEffect(() => {
    const workspaceHistoryRecordsSubscription = listenWorkspaceHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        setHistoryRecords(nextHistoryRecords);
      }
    );
    return () => workspaceHistoryRecordsSubscription.unsubscribe();
  }, []);

  return (
    <ul
      className={`list-group list-group-flush overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}
    >
      {historyRecords.map((historyRecord) => {
        let oldValue: string | number | null;
        let value: string | number | null;
        if (historyRecord.action == "creationTime" || historyRecord.action == "placingInBinTime") {
          oldValue =
            historyRecord.oldValue === null ? null : (historyRecord.oldValue as Date).getTime();
          value = historyRecord.value === null ? null : (historyRecord.value as Date).getTime();
        } else {
          oldValue = historyRecord.oldValue as string | null;
          value = historyRecord.value as string | null;
        }
        return (
          <RoomHistoryRecord
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
