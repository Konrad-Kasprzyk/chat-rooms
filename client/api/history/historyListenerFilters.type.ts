import HistoryModels from "common/types/history/historyModels.type";

type HistoryListenerFilters = {
  [K in keyof HistoryModels]: {
    /**
     * The task or goal document id to obtain history records. For other history keys it is undefined.
     */
    docId?: string;
    /**
     * If set to true, the history records listener will load more history records if there are
     * more to load, then set it to false.
     */
    loadMoreChunks: boolean;
    /**
     * When all available chunks are loaded, this is set to true by a history records listener.
     */
    allChunksLoaded?: boolean;
    sort: "newestFirst" | "oldestFirst";
  } | null;
};

export default HistoryListenerFilters;
