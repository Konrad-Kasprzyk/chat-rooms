import { memo } from "react";
import styles from "./otherUserMessage.module.scss";

const OtherUserMessage = memo(function OtherUserMessage(props: {
  dateMillis: number | null;
  message: string;
}) {
  return (
    <div className="hstack align-items-end justify-content-start w-100">
      <div className={`px-2 py-1 me-1 text-break ${styles.message}`}>{props.message}</div>
      {props.dateMillis ? (
        <small className="text-secondary">{new Date(props.dateMillis).toLocaleTimeString()}</small>
      ) : null}
    </div>
  );
});

export default OtherUserMessage;
