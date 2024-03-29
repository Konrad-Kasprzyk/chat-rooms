import listenChatHistoryRecords from "client/api/history/chatHistory/listenChatHistoryRecords.api";
import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownCircleFill } from "react-bootstrap-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatMessage from "./ChatMessage";
import styles from "./roomChat.module.scss";

export default function RoomChat() {
  const [messages, setMessages] = useState<
    {
      key: number;
      senderUsername: string;
      dateMillis: number;
      message: string;
      showSenderUsername: boolean;
    }[]
  >([]);
  const [allHistoryRecordsLoaded, setAllHistoryRecordsLoaded] = useState(
    getHistoryListenerState()?.ChatHistory?.allChunksLoaded === true
  );
  const [messageToSend, setMessageToSend] = useState("");
  const [hideBackToBottomButton, setHideBackToBottomButton] = useState(true);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const chatHistoryRecordsSubscription = listenChatHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        const nextMessages = [];
        let previousMessageSenderId = "";
        for (const historyRecord of nextHistoryRecords) {
          nextMessages.push({
            key: historyRecord.id,
            senderUsername: historyRecord.user ? historyRecord.user.username : "",
            dateMillis: historyRecord.date.getTime(),
            message: historyRecord.value || "",
            showSenderUsername: previousMessageSenderId != historyRecord.userId,
          });
          previousMessageSenderId = historyRecord.userId;
        }
        setMessages(nextMessages);
      }
    );
    return () => chatHistoryRecordsSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const historyFiltersStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerState) => {
        if (nextHistoryListenerState?.ChatHistory?.allChunksLoaded === true)
          setAllHistoryRecordsLoaded(true);
        else setAllHistoryRecordsLoaded(false);
      }
    );
    return () => historyFiltersStateSubscription.unsubscribe();
  }, []);

  function loadMoreHistoryRecords() {
    setHistoryListenerState("ChatHistory", {
      loadMoreChunks: true,
      sort: "newestFirst",
    });
  }

  return (
    <div
      id="usersHistoryListScrollableContainer"
      className={`card vstack h-100 mb-md-2 mb-xxl-3 ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}
      ref={scrollableContainerRef}
    >
      <div className={`${styles.backToTopButtonContainer}`}>
        <button
          className={`btn btn-sm ${styles.backToTopButton}`}
          style={{ display: hideBackToBottomButton ? "none" : "block" }}
          onClick={() => {
            if (!scrollableContainerRef.current) return;
            scrollableContainerRef.current.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDownCircleFill className={`${styles.backToTopIcon}`} />
        </button>
      </div>
      <div className={`card-body flex-fill ${styles.chatMessagesContainer}`}>
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreHistoryRecords}
          hasMore={!allHistoryRecordsLoaded}
          loader={<h4 className="loader text-primary text-center mt-2">Loading...</h4>}
          scrollableTarget="usersHistoryListScrollableContainer"
          onScroll={() => {
            if (!scrollableContainerRef.current) return;
            setHideBackToBottomButton(scrollableContainerRef.current.scrollTop < 200);
          }}
        >
          {messages.length == 0 ? (
            <span>Send first message!</span>
          ) : (
            <ul>
              {messages.map((message) => (
                <ChatMessage
                  key={message.key}
                  senderUsername={message.senderUsername}
                  dateMillis={message.dateMillis}
                  message={message.message}
                  showSenderUsername={message.showSenderUsername}
                />
              ))}
            </ul>
          )}
        </InfiniteScroll>
      </div>
      <div className="card-footer">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            aria-label="message to send"
            aria-describedby="sendMessage"
            value={messageToSend}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageToSend(e.target.value)}
          />
          <span className="input-group-text" id="sendMessage">
            Send
          </span>
        </div>
      </div>
    </div>
  );
}
