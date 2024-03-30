import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenUsersHistoryRecords from "client/api/history/usersHistory/listenUsersHistoryRecords.api";
import historyListStyles from "client/components/rooms/room/historyList.module.scss";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import ArchivedUser from "common/types/history/archivedUser.type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpCircleFill } from "react-bootstrap-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import UsersHistoryRecord from "./UsersHistoryRecord";

export default function UsersHistoryList() {
  const [historyRecords, setHistoryRecords] = useState<UsersHistory["history"]>([]);
  const [allHistoryRecordsLoaded, setAllHistoryRecordsLoaded] = useState(
    getHistoryListenerState()?.UsersHistory?.allChunksLoaded === true
  );
  const [hideBackToTopButton, setHideBackToTopButton] = useState(true);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const usersHistoryRecordsSubscription = listenUsersHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        setHistoryRecords(nextHistoryRecords);
      }
    );
    return () => usersHistoryRecordsSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const historyFiltersStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerState) => {
        if (nextHistoryListenerState?.UsersHistory?.allChunksLoaded === true)
          setAllHistoryRecordsLoaded(true);
        else setAllHistoryRecordsLoaded(false);
      }
    );
    return () => historyFiltersStateSubscription.unsubscribe();
  }, []);

  function loadMoreHistoryRecords() {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: true,
      sort: "newestFirst",
    });
  }

  return historyRecords.length == 0 ? (
    <div className="mt-5">
      <h4 className="text-center">No history records.</h4>
      <h4 className="text-center">Invite someone!</h4>
    </div>
  ) : (
    <div
      id="usersHistoryListScrollableContainer"
      className={`vstack overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT} px-1 ${historyListStyles.historyListScrollableContainer}`}
      ref={scrollableContainerRef}
    >
      <div className={`${historyListStyles.backToTopButtonContainer}`}>
        <button
          className={`btn btn-sm ${historyListStyles.backToTopButton}`}
          style={{ display: hideBackToTopButton ? "none" : "block" }}
          onClick={() => {
            if (!scrollableContainerRef.current) return;
            scrollableContainerRef.current.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowUpCircleFill className={`${historyListStyles.backToTopIcon}`} />
        </button>
      </div>
      <InfiniteScroll
        dataLength={historyRecords.length}
        next={loadMoreHistoryRecords}
        hasMore={!allHistoryRecordsLoaded}
        loader={<h4 className="loader text-primary text-center mt-2">Loading...</h4>}
        scrollableTarget="usersHistoryListScrollableContainer"
        onScroll={() => {
          if (!scrollableContainerRef.current) return;
          setHideBackToTopButton(scrollableContainerRef.current.scrollTop < 200);
        }}
      >
        <ul className="list-group list-group-flush">
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
                historyRecord.value === null
                  ? null
                  : (historyRecord.value as ArchivedUser).username;
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
      </InfiniteScroll>
    </div>
  );
}
