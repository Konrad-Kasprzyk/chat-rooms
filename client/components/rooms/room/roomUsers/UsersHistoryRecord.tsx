import historyRecordStyles from "../historyRecord.module.scss";

export default function UsersHistoryRecord(props: {
  action: "invitedUserEmails" | "users" | "allInvitationsCancel" | "userRemovedFromWorkspace";
  actionMakerUsername: string;
  dateMillis: number;
  oldValue: string | null;
  value: string | null;
}) {
  let recordTextToRender: JSX.Element;
  switch (props.action) {
    case "invitedUserEmails":
      recordTextToRender = (
        <>
          {props.actionMakerUsername ? (
            <>
              <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                {props.actionMakerUsername}
              </span>
              <span> {props.oldValue === null ? " invited " : " cancelled invitation "}</span>
            </>
          ) : (
            <span>{props.oldValue === null ? "Invited " : "Cancelled invitation "}</span>
          )}
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {props.oldValue === null ? props.value : props.oldValue}
          </span>
        </>
      );
      break;
    case "users":
    case "userRemovedFromWorkspace":
      recordTextToRender = (
        <>
          {props.actionMakerUsername ? (
            <>
              <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                {props.actionMakerUsername}
              </span>
              <span> {props.oldValue === null ? " added " : " removed "}</span>
            </>
          ) : (
            <span>{props.oldValue === null ? "Added " : "Removed "}</span>
          )}
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {props.oldValue === null ? props.value : props.oldValue}
          </span>
        </>
      );
      break;
    case "allInvitationsCancel":
      recordTextToRender = (
        <>
          {props.actionMakerUsername ? (
            <>
              <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
                {props.actionMakerUsername}
              </span>
              <span> cancelled all invitations</span>
            </>
          ) : (
            <span>Cancelled all invitations</span>
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
}
