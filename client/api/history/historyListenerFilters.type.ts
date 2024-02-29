import HistoryModels from "common/types/history/historyModels.type";

type HistoryListenerFilters = {
  [K in keyof HistoryModels]: {
    /**
     * The task or goal document id to obtain history records. For other history keys it is undefined.
     */
    docId?: string;
    /**
     * When set to true, the history records listener will load more history records and set it to
     * false afterwards. For the first history chunk it does not matter if it is set to true or false,
     * it will get the first chunk of history records automatically.
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
