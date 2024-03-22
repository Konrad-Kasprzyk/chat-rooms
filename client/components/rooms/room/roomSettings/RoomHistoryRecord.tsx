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
  switch (props.action) {
    case "title":
      recordTextToRender = (
        <>
          {props.actionMakerUsername ? (
            <>
              <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                {props.actionMakerUsername}
              </span>
              <span> changed title to </span>
            </>
          ) : (
            <span>Changed title to </span>
          )}
          <span className="fw-bold">{props.value}</span>
        </>
      );
      break;
    case "description":
      recordTextToRender = (
        <>
          {props.value ? (
            <>
              {props.actionMakerUsername ? (
                <>
                  <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                    {props.actionMakerUsername}
                  </span>
                  <span> changed description to </span>
                </>
              ) : (
                <span>Changed description to </span>
              )}
              <span className="fw-bold">{props.value}</span>
            </>
          ) : (
            <>
              {props.actionMakerUsername ? (
                <>
                  <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                    {props.actionMakerUsername}
                  </span>
                  <span> removed the description</span>
                </>
              ) : (
                <span>Removed the description</span>
              )}
            </>
          )}
        </>
      );
      break;
    case "creationTime":
      recordTextToRender = (
        <>
          {props.actionMakerUsername ? (
            <>
              <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                {props.actionMakerUsername}
              </span>
              <span> created the chat room</span>
            </>
          ) : (
            <span>Created the chat room</span>
          )}
        </>
      );
      break;
    case "placingInBinTime":
      if (props.oldValue === null)
        recordTextToRender = (
          <>
            {props.actionMakerUsername ? (
              <>
                <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                  {props.actionMakerUsername}
                </span>
                <span> deleted the chat room</span>
              </>
            ) : (
              <span>Deleted the chat room</span>
            )}
          </>
        );
      else
        recordTextToRender = (
          <>
            {props.actionMakerUsername ? (
              <>
                <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                  {props.actionMakerUsername}
                </span>
                <span> restored the chat room</span>
              </>
            ) : (
              <span>Restored the chat room</span>
            )}
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
