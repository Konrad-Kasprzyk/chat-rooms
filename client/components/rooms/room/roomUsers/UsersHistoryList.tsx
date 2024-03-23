import listenUsersHistoryRecords from "client/api/history/usersHistory/listenUsersHistoryRecords.api";
import backToTopButtonStyles from "client/components/rooms/room/backToTopButton.module.scss";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import ArchivedUser from "common/types/history/archivedUser.type";
import { useEffect, useLayoutEffect, useState } from "react";
import UsersHistoryRecord from "./UsersHistoryRecord";

export default function UsersHistoryList() {
  const [historyRecords, setHistoryRecords] = useState<UsersHistory["history"]>([]);
  const [hideBackToTopButton, setHideBackToTopButton] = useState(true);

  useLayoutEffect(() => {
    const usersHistoryRecordsSubscription = listenUsersHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        setHistoryRecords(nextHistoryRecords);
      }
    );
    return () => usersHistoryRecordsSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    function decideIfShowBackToTopButton() {
      setHideBackToTopButton(window.scrollY < 300);
    }

    document.addEventListener("scroll", decideIfShowBackToTopButton);
    return () => document.removeEventListener("scroll", decideIfShowBackToTopButton);
  }, []);

  return historyRecords.length == 0 ? (
    <div className="mt-5">
      <h4 className="text-center">No history records.</h4>
      <h4 className="text-center">Invite someone!</h4>
    </div>
  ) : (
    <div>
      <button
        className={`btn btn-primary ${backToTopButtonStyles.backToTopButton}`}
        style={{ display: hideBackToTopButton ? "none" : "block" }}
        onClick={() =>
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
        }
      >
        Back to top
      </button>
      <ul
        className={`list-group list-group-flush overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}
      >
        {historyRecords.map((historyRecord) => {
          let oldValue: string | null;
          let value: string | null;
          if (
            historyRecord.action == "users" ||
            historyRecord.action == "userRemovedFromWorkspace"
          ) {
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
    </div>
  );
}
