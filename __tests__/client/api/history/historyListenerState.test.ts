import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import HistoryListenerFilters from "client/api/history/historyListenerFilters.type";
import {
  _historyListenerStateExportedForTesting,
  getHistoryListenerState,
  setHistoryListenerState,
  setHistoryListenerStateToNull,
} from "client/api/history/historyListenerState.utils";

describe("Test setting history listener state", () => {
  let initialListenerState: HistoryListenerFilters;

  beforeAll(async () => {
    await globalBeforeAll();
    if (!_historyListenerStateExportedForTesting)
      throw new Error("historyListenerState.utils module didn't export functions for testing.");
    initialListenerState = _historyListenerStateExportedForTesting.initialListenerState;
  }, BEFORE_ALL_TIMEOUT);

  it("Sets history filter when listener state is set to null", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
  });

  it("Sets history filters to null when listener state is null", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerStateToNull();

    expect(getHistoryListenerState()).toBeNull();
  });

  it("Sets history filters to null when listener state is not null", () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });

    setHistoryListenerStateToNull();

    expect(getHistoryListenerState()).toBeNull();
  });

  it("Sets history filter to initial state", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
    setHistoryListenerState("UsersHistory", null);

    expect(getHistoryListenerState()).toEqual(initialListenerState);
  });

  it("Sets history filter when listener state has only one history filter set and this only history filter is changed", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: true,
      sort: "oldestFirst",
    });

    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: true,
        sort: "oldestFirst",
      },
    });
  });

  it("Sets history filter when listener state has only one history filter set and an other history filter is changed", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: true,
      sort: "oldestFirst",
    });

    expect(getHistoryListenerState()).toEqual({
      ...initialListenerState,
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
      WorkspaceHistory: {
        loadMoreChunks: true,
        sort: "oldestFirst",
      },
    });
  });

  it("Sets history filter when listener state has all history filters set", () => {
    setHistoryListenerStateToNull();
    expect(getHistoryListenerState()).toBeNull();

    setHistoryListenerState("ChatHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    expect(getHistoryListenerState()).toEqual({
      ChatHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
      UsersHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
      WorkspaceHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: true,
      sort: "oldestFirst",
    });

    expect(getHistoryListenerState()).toEqual({
      ChatHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
      UsersHistory: {
        loadMoreChunks: true,
        sort: "oldestFirst",
      },
      WorkspaceHistory: {
        loadMoreChunks: false,
        sort: "newestFirst",
      },
    });
  });
});
