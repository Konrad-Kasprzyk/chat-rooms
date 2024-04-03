import listenChatHistoryRecords from "client/api/history/chatHistory/listenChatHistoryRecords.api";
import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import sendMessage from "client/api/workspace/sendMessage.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import User from "common/clientModels/user.model";
import { ChangeEvent, MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownCircleFill, SendFill } from "react-bootstrap-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatMessage from "./ChatMessage";
import styles from "./roomChat.module.scss";

export default function RoomChat(props: { messageTextRef: MutableRefObject<string> }) {
  /**
   * Messages are sorted from oldest to newest, because the chat infinitive scroll component is
   * showing messages in reverse order to show the newest messages at the bottom.
   */
  const [messages, setMessages] = useState<
    {
      key: number;
      senderId: string;
      senderUsername: string;
      dateMillis: number | null;
      message: string;
      showSenderUsername: boolean;
    }[]
  >([]);
  const [allHistoryRecordsLoaded, setAllHistoryRecordsLoaded] = useState(
    getHistoryListenerState()?.ChatHistory?.allChunksLoaded === true
  );
  const [hideBackToBottomButton, setHideBackToBottomButton] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const editableContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const chatHistoryRecordsSubscription = listenChatHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        const nextMessages = [];
        let previousMessageSenderId = "";
        for (const historyRecord of nextHistoryRecords) {
          nextMessages.unshift({
            key: historyRecord.id,
            senderId: historyRecord.userId,
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
    const currentUserSubscription = listenCurrentUser().subscribe((nextUser) => setUser(nextUser));
    return () => currentUserSubscription.unsubscribe();
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
      className={`card vstack h-100 mb-lg-2 ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT} ${styles.chatMessagesContainer}`}
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
      <div
        id="usersHistoryListScrollableContainer"
        className={`card-body d-flex flex-column-reverse overflow-auto py-0`}
        ref={scrollableContainerRef}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreHistoryRecords}
          className="d-flex flex-column-reverse" //To put loader on top.
          inverse={true}
          hasMore={!allHistoryRecordsLoaded}
          loader={
            <div className="spinner-border text-primary align-self-center mt-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          }
          scrollableTarget="usersHistoryListScrollableContainer"
          onScroll={() => {
            if (!scrollableContainerRef.current) return;
            setHideBackToBottomButton(scrollableContainerRef.current.scrollTop < 200);
          }}
        >
          {messages.length == 0 ? (
            <span className="text-center">Say hello!</span>
          ) : (
            <ul className="m-0">
              {messages.map((message) => (
                <ChatMessage
                  key={message.key}
                  senderId={message.senderId}
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
      <div className="card-footer p-1 py-md-2 pe-md-2 ps-md-3">
        <div className="hstack align-items-end">
          <div
            className={`form-control ${styles.messageText}`}
            contentEditable
            suppressContentEditableWarning={true}
            aria-label="message to send"
            aria-describedby="sendMessage"
            custom-placeholder="Message"
            onInput={(e: ChangeEvent<HTMLDivElement>) =>
              (props.messageTextRef.current = e.target.textContent || "")
            }
            ref={editableContentRef}
          >
            {props.messageTextRef.current}
          </div>
          <button
            className={`btn btn-sm btn-outline-primary ms-1 ms-md-2`}
            style={{ borderColor: "transparent" }}
            id="sendMessage"
            onClick={() => {
              const trimmedMessage = props.messageTextRef.current;
              if (!trimmedMessage || !user) return;
              sendMessage(trimmedMessage);
              props.messageTextRef.current = "";
              if (editableContentRef.current) editableContentRef.current.innerText = "";
              setMessages([
                ...messages,
                {
                  key: messages.length == 0 ? 0 : messages[messages.length - 1].key + 1,
                  senderId: user.id,
                  senderUsername: user.username,
                  dateMillis: null,
                  message: trimmedMessage,
                  showSenderUsername:
                    messages.length == 0 || messages[messages.length - 1].senderId != user.id,
                },
              ]);
            }}
          >
            <SendFill className={`${styles.sendIcon}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
