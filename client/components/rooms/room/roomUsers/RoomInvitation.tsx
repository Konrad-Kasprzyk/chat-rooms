import useWindowSize from "app/hooks/useWindowSize.hook";
import CopyIcon from "client/components/CopyIcon";
import TruncatedEmail from "client/components/TruncatedEmail";
import roomStyles from "client/components/rooms/room/room.module.scss";
import { memo, useRef } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";

const RoomInvitation = memo(function RoomInvitation(props: {
  email: string;
  showCancelInvitationModal: (emailToCancelInvitation: string) => void;
}) {
  const truncatedEmailContainerRef = useRef<HTMLLIElement>(null);
  const { width } = useWindowSize();

  return (
    <li
      className="list-group-item d-flex justify-content-between px-1 my-2 pb-3"
      style={{ width: "100%" }}
      ref={truncatedEmailContainerRef}
    >
      {/* Three dots icon with li margins and padding take 22 px */}
      <span className="hstack" style={{ maxWidth: "calc(100% - 22px)" }}>
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
                props.showCancelInvitationModal(props.email);
              }}
            >
              <strong className="text-danger">Cancel invitation</strong>
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
});

export default RoomInvitation;
