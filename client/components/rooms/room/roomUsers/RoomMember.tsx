import useWindowSize from "app/hooks/useWindowSize.hook";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import CopyIcon from "client/components/CopyIcon";
import TruncatedEmail from "client/components/TruncatedEmail";
import roomStyles from "client/components/rooms/room/room.module.scss";
import { memo, useRef } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";

const RoomMember = memo(function RoomMember(props: {
  userId: string;
  username: string;
  email: string;
  showRemoveUserModal: (userIdToRemove: string, username: string) => void;
}) {
  const truncatedEmailContainerRef = useRef<HTMLLIElement>(null);
  const { width } = useWindowSize();

  return (
    <li
      className="list-group-item d-flex justify-content-between px-1 my-2 pb-3"
      style={{ width: "100%" }}
      ref={truncatedEmailContainerRef}
    >
      {/* Three dots icon with li margins and padding takes 22 px */}
      <div className="vstack" style={{ maxWidth: "calc(100% - 22px)" }}>
        <span className="fw-bold text-truncate me-auto" style={{ maxWidth: "100%" }}>
          {props.username}
        </span>
        <span className="hstack" style={{ maxWidth: "100%" }}>
          {/* Copy email icon with margin take 20 px */}
          <span className="align-content-center" style={{ maxWidth: "calc(100% - 20px)" }}>
            <TruncatedEmail
              email={props.email}
              containerToObserveWidthChanges={truncatedEmailContainerRef.current}
              textClassName="small"
            />
          </span>
          <span className="align-content-center p-0" style={{ marginLeft: "4px" }}>
            <CopyIcon textToCopy={props.email} popupDirection="bottom" />
          </span>
        </span>
      </div>

      {getSignedInUserId() == props.userId ? null : (
        <div className="btn-group dropstart">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0 rounded-1 p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <ThreeDotsVertical className={`${roomStyles.threeDots}`} />
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                type="button"
                className="dropdown-item btn btn-danger"
                onClick={() => {
                  props.showRemoveUserModal(props.userId, props.username);
                }}
              >
                <strong className="text-danger">Remove user</strong>
              </button>
            </li>
          </ul>
        </div>
      )}
    </li>
  );
});

export default RoomMember;
