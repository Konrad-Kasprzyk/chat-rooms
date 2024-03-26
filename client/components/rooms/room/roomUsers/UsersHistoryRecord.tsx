import { memo } from "react";
import historyRecordStyles from "../historyRecord.module.scss";

const UsersHistoryRecord = memo(function UsersHistoryRecord(props: {
  action: "invitedUserEmails" | "users" | "allInvitationsCancel" | "userRemovedFromWorkspace";
  actionMakerUsername: string;
  dateMillis: number;
  oldValue: string | null;
  value: string | null;
}) {
  let recordTextToRender: JSX.Element;
  const actionMakerUsername = props.actionMakerUsername
    ? props.actionMakerUsername
    : "[user removed]";
  const oldUsernameValue = props.oldValue ? props.oldValue : "[user removed]";
  const usernameValue = props.value ? props.value : "[user removed]";

  switch (props.action) {
    case "invitedUserEmails":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> {props.oldValue === null ? " invited " : " cancelled invitation "}</span>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {props.oldValue === null ? props.value : props.oldValue}
          </span>
        </>
      );
      break;
    case "users":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {usernameValue}
          </span>
          <span> accepted invitation</span>
        </>
      );
      break;
    case "userRemovedFromWorkspace":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> removed </span>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {oldUsernameValue}
          </span>
        </>
      );
      break;
    case "allInvitationsCancel":
      recordTextToRender = (
        <>
          <span className={`fw-bold ${historyRecordStyles.oneLineTextTruncate}`}>
            {actionMakerUsername}
          </span>
          <span> cancelled all invitations</span>
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

export default UsersHistoryRecord;
