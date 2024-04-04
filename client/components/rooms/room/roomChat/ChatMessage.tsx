import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import { memo, useEffect, useState } from "react";
import OtherUserMessage from "./OtherUserMessage";
import SignedInUserMessage from "./SignedInUserMessage";

const ChatMessage = memo(function ChatMessage(props: {
  senderId: string;
  senderUsername: string;
  dateMillis: number | null;
  message: string;
  showSenderUsername: boolean;
}) {
  const [signedInUserId, setSignedInUserId] = useState(getSignedInUserId());

  useEffect(() => {
    const signedInUserIdSubscription = listenSignedInUserIdChanges().subscribe(
      (nextSignedInUserId) => setSignedInUserId(nextSignedInUserId)
    );
    return () => signedInUserIdSubscription.unsubscribe();
  }, []);

  const senderUsername = props.senderUsername || "[user removed]";

  return (
    <li className="list-group-item vstack px-0 mb-2">
      {signedInUserId == props.senderId ? (
        <>
          {props.showSenderUsername ? (
            <div className="hstack gap-2 align-self-end my-2">
              {props.dateMillis ? (
                <small className="text-secondary">
                  {new Date(props.dateMillis).toLocaleDateString()}
                </small>
              ) : null}
              <span>{senderUsername}</span>
            </div>
          ) : null}
          <SignedInUserMessage dateMillis={props.dateMillis} message={props.message} />
        </>
      ) : (
        <>
          {props.showSenderUsername ? (
            <div className="hstack gap-2 align-self-start my-2">
              <span>{senderUsername}</span>
              {props.dateMillis ? (
                <small className="text-secondary">
                  {new Date(props.dateMillis).toLocaleDateString()}
                </small>
              ) : null}
            </div>
          ) : null}
          <OtherUserMessage dateMillis={props.dateMillis} message={props.message} />
        </>
      )}
    </li>
  );
});

export default ChatMessage;
