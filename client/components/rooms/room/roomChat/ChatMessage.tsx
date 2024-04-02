import { memo } from "react";

const ChatMessage = memo(function ChatMessage(props: {
  senderId: string;
  senderUsername: string;
  dateMillis: number | null;
  message: string;
  showSenderUsername: boolean;
}) {
  return (
    <li className="list-group-item vstack px-0 mb-1">
      {props.dateMillis ? <small>{new Date(props.dateMillis).toLocaleString()}</small> : null}
      {props.showSenderUsername ? <small>{props.senderUsername || "[user removed]"}</small> : null}
      <small>{props.message}</small>
    </li>
  );
});

export default ChatMessage;
