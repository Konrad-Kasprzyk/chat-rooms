import { memo } from "react";

const ChatMessage = memo(function ChatMessage(props: {
  senderUsername: string;
  dateMillis: number;
  message: string;
  showSenderUsername: boolean;
}) {
  return (
    <li className="list-group-item vstack px-0 mb-1">
      <small>{new Date(props.dateMillis).toLocaleString()}</small>
      {props.showSenderUsername ? <small>{props.senderUsername || "[user removed]"}</small> : null}
      <small>message</small>
    </li>
  );
});

export default ChatMessage;
