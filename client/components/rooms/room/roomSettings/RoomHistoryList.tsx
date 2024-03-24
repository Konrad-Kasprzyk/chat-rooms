import {
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenWorkspaceHistoryRecords from "client/api/history/workspaceHistory/listenWorkspaceHistoryRecords.api";
import historyListStyles from "client/components/rooms/room/historyList.module.scss";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RoomHistoryRecord from "./RoomHistoryRecord";

export default function RoomHistoryList() {
  const [historyRecords, setHistoryRecords] = useState<WorkspaceHistory["history"]>([]);
  const [allHistoryRecordsLoaded, setAllHistoryRecordsLoaded] = useState(false);
  const [hideBackToTopButton, setHideBackToTopButton] = useState(true);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const workspaceHistoryRecordsSubscription = listenWorkspaceHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        setHistoryRecords(nextHistoryRecords);
      }
    );
    return () => workspaceHistoryRecordsSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const historyFiltersStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerState) => {
        if (nextHistoryListenerState?.WorkspaceHistory?.allChunksLoaded === true)
          setAllHistoryRecordsLoaded(true);
        else setAllHistoryRecordsLoaded(false);
      }
    );
    return () => historyFiltersStateSubscription.unsubscribe();
  }, []);

  function loadMoreHistoryRecords() {
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: true,
      sort: "newestFirst",
    });
  }

  return (
    <div
      id="roomHistoryListScrollableContainer"
      className={`vstack overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT} ${historyListStyles.historyListScrollableContainer}`}
      ref={scrollableContainerRef}
    >
      <div className={`${historyListStyles.backToTopButtonContainer}`}>
        <button
          className={`btn btn-primary ${historyListStyles.backToTopButton}`}
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
          Back to top
        </button>
      </div>
      <InfiniteScroll
        dataLength={historyRecords.length}
        next={loadMoreHistoryRecords}
        hasMore={!allHistoryRecordsLoaded}
        loader={<h4 className="loader text-primary text-center mt-2">Loading...</h4>}
        scrollableTarget="roomHistoryListScrollableContainer"
        onScroll={() => {
          if (!scrollableContainerRef.current) return;
          setHideBackToTopButton(scrollableContainerRef.current.scrollTop < 200);
        }}
      >
        <ul className="list-group list-group-flush">
          {historyRecords.map((historyRecord) => {
            let oldValue: string | number | null;
            let value: string | number | null;
            if (
              historyRecord.action == "creationTime" ||
              historyRecord.action == "placingInBinTime"
            ) {
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
      </InfiniteScroll>
    </div>
  );
}
