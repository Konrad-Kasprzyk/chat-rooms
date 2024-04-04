import { memo } from "react";
import historyRecordStyles from "../historyRecord.module.scss";

const RoomHistoryRecord = memo(function RoomHistoryRecord(props: {
  action: "title" | "description" | "creationTime" | "placingInBinTime";
  actionMakerUsername: string;
  dateMillis: number;
  oldValue: string | number | null;
  value: string | number | null;
}) {
  let recordTextToRender: JSX.Element;
  const actionMakerUsername = props.actionMakerUsername
    ? props.actionMakerUsername
    : "[user removed]";

  switch (props.action) {
    case "title":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> </span>
          <span>changed title to</span>
          <span> </span>
          <span className="fw-bold">{props.value}</span>
        </>
      );
      break;
    case "description":
      recordTextToRender = props.value ? (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> </span>
          <span>changed description to</span>
          <span> </span>
          <span className="fw-bold">{props.value}</span>
        </>
      ) : (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> </span>
          <span>removed the description</span>
        </>
      );
      break;
    case "creationTime":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> </span>
          <span>created the chat room</span>
        </>
      );
      break;
    case "placingInBinTime":
      recordTextToRender =
        props.oldValue === null ? (
          <>
            <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
              {actionMakerUsername}
            </span>
            <span> </span>
            <span>deleted the chat room</span>
          </>
        ) : (
          <>
            <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
              {actionMakerUsername}
            </span>
            <span> </span>
            <span>restored the chat room</span>
          </>
        );
      break;
    default:
      recordTextToRender = <span></span>;
  }

  return (
    <li className="list-group-item vstack px-0 mb-1">
      <small>{new Date(props.dateMillis).toLocaleString()}</small>
      <small className={`${historyRecordStyles.lineClampWrapper}`}>{recordTextToRender}</small>
    </li>
  );
});

export default RoomHistoryRecord;
