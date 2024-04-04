import useWindowSize from "app/hooks/useWindowSize.hook";
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
import { ArrowDownCircle, SendFill } from "react-bootstrap-icons";
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
  const [user, setUser] = useState<User | null>(null);
  const [isNewestMessageVisible, setIsNewestMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState(props.messageTextRef.current);
  const [maxMessageTextHeigh, setMaxMessageTextHeigh] = useState(0);
  const isNewestMessageVisibleRef = useRef<boolean>(false);
  const messagesListRef = useRef<HTMLUListElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const messageTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { height } = useWindowSize();
  /**
   * Maximum height of typed message compared to the height of displayed chat messages.
   */
  const messageTextHeightRatio = 0.5;

  useLayoutEffect(() => {
    const chatHistoryRecordsSubscription = listenChatHistoryRecords().subscribe(
      (nextHistoryRecords) => {
        if (nextHistoryRecords.length == 0) {
          setMessages([]);
          return;
        }
        const historyRecordsFromOldestToNewest = [...nextHistoryRecords].reverse();
        const nextMessages = [
          {
            key: historyRecordsFromOldestToNewest[0].id,
            senderId: historyRecordsFromOldestToNewest[0].userId,
            senderUsername: historyRecordsFromOldestToNewest[0].user
              ? historyRecordsFromOldestToNewest[0].user.username
              : "",
            dateMillis: historyRecordsFromOldestToNewest[0].date.getTime(),
            message: historyRecordsFromOldestToNewest[0].value || "",
            showSenderUsername: true,
          },
        ];
        let previousMessageSenderId = historyRecordsFromOldestToNewest[0].userId;
        for (const historyRecord of historyRecordsFromOldestToNewest.slice(1)) {
          nextMessages.push({
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

  useEffect(() => {
    if (!messagesListRef.current) return;
    const newestMessageElement = messagesListRef.current.lastElementChild;
    if (!newestMessageElement) return;
    const newestMessageIntersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNewestMessageVisible(true);
        isNewestMessageVisibleRef.current = true;
      } else {
        setIsNewestMessageVisible(false);
        isNewestMessageVisibleRef.current = false;
      }
    });
    // Scroll to bottom when a new message is received and the user has not scrolled to older messages.
    if (isNewestMessageVisibleRef.current && scrollableContainerRef.current)
      scrollableContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    newestMessageIntersectionObserver.observe(newestMessageElement);
    return () => newestMessageIntersectionObserver.disconnect();
  }, [messages]);

  useEffect(() => {
    if (!scrollableContainerRef.current) return;
    setMaxMessageTextHeigh(
      Math.ceil(scrollableContainerRef.current.clientHeight * messageTextHeightRatio)
    );
  }, [height]);

  useEffect(() => {
    if (!messageTextAreaRef.current || !scrollableContainerRef.current) return;
    if (messageTextAreaRef.current.scrollHeight < maxMessageTextHeigh) {
      messageTextAreaRef.current.style.overflow = "hidden";
      messageTextAreaRef.current.style.height = "auto";
      messageTextAreaRef.current.style.height = messageTextAreaRef.current.scrollHeight + "px";
      return;
    }
    messageTextAreaRef.current.style.overflow = "auto";
    messageTextAreaRef.current.style.height = "auto";
    messageTextAreaRef.current.style.height = maxMessageTextHeigh + "px";
  }, [messageText, maxMessageTextHeigh]);

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
        >
          {messages.length == 0 && allHistoryRecordsLoaded ? (
            <span className="text-center">Say hello!</span>
          ) : (
            <ul className="m-0 p-0" ref={messagesListRef}>
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
      <div className={`${styles.backToBottomButtonContainer}`}>
        <button
          className={`btn btn-sm ${styles.backToBottomButton}`}
          style={{ display: isNewestMessageVisible || messages.length == 0 ? "none" : "block" }}
          onClick={() => {
            if (!scrollableContainerRef.current) return;
            scrollableContainerRef.current.scrollTo({
              top: 0,
              left: 0,
              behavior: "instant",
            });
          }}
        >
          <ArrowDownCircle className={`${styles.backToBottomIcon}`} />
        </button>
      </div>
      <div className="card-footer p-1 py-md-2 pe-md-2 ps-md-3">
        <div className="hstack align-items-end">
          <textarea
            className={`form-control ${styles.messageText}`}
            rows={1}
            aria-label="message to send"
            aria-describedby="sendMessage"
            placeholder="Message"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setMessageText(e.target.value);
              props.messageTextRef.current = e.target.value;
            }}
            value={messageText}
            ref={messageTextAreaRef}
          />
          <button
            className={`ms-1 ms-md-2 ${styles.sendButton}`}
            id="sendMessage"
            onClick={() => {
              const trimmedMessage = messageText.trim();
              if (!trimmedMessage || !user) return;
              sendMessage(trimmedMessage);
              setMessageText("");
              props.messageTextRef.current = "";
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
