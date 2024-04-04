import { memo } from "react";
import styles from "./signedInUserMessage.module.scss";

const SignedInUserMessage = memo(function SignedInUserMessage(props: {
  dateMillis: number | null;
  message: string;
}) {
  return (
    <div className="hstack align-items-end justify-content-end w-100">
      {props.dateMillis ? (
        <small className="text-secondary">{new Date(props.dateMillis).toLocaleTimeString()}</small>
      ) : null}
      <div className={`px-2 py-1 ms-1 text-break ${styles.message}`}>{props.message}</div>
    </div>
  );
});

export default SignedInUserMessage;
