"use client";

import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import styles from "./roomList.module.scss";

const Room = memo(function RoomItem(props: {
  id: string;
  title: string;
  description: string;
  showLeaveRoomModal: (roomId: string) => void;
}) {
  const { push } = useRouter();

  return (
    <li className="list-group-item hstack px-0">
      <a
        role="button"
        className="btn btn-outline-primary btn-sm border-0 vstack py-2 py-sm-3 px-sm-3"
        style={{ textDecoration: "none", minWidth: "0" }}
        href={`/rooms/${props.id}`}
        onClick={linkHandler(`/rooms/${props.id}`, push)}
      >
        <h5 className="mb-0 text-start text-truncate">{props.title}</h5>
        <small className="text-body-secondary text-start text-truncate">{props.description}</small>
      </a>
      <div className="btn-group dropstart">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm border-0 rounded-1 px-0 py-0 py-sm-1 me-1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <ThreeDotsVertical className={`${styles.threeDots}`} />
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              type="button"
              className="dropdown-item btn btn-danger"
              onClick={() => props.showLeaveRoomModal(props.id)}
            >
              <strong className="text-danger">Leave room</strong>
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
});

export default Room;
