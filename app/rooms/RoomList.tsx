"use client";

import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import linkHandler from "client/utils/components/linkHandler.util";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import styles from "./roomList.module.scss";

export default function RoomList() {
  const [rooms, setRooms] = useState<WorkspaceSummary[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe(
      (workspaceSummaries) => setRooms(workspaceSummaries.docs)
    );
    return () => workspaceSummariesSubscription.unsubscribe();
  }, []);

  return (
    <ul className={`list-group ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}>
      {rooms.map((room) => (
        <li key={room.id} className="list-group-item hstack px-0">
          <a
            role="button"
            className="btn btn-link btn-sm vstack py-2 py-sm-3 px-sm-3"
            style={{ textDecoration: "none", minWidth: "0" }}
            href={`/rooms/${room.id}`}
            onClick={linkHandler(`/rooms/${room.id}`, push)}
          >
            <h5 className="mb-0 text-start text-truncate">{room.title}</h5>
            <small className="text-body-secondary text-start text-truncate">
              {room.description}
            </small>
          </a>
          <div className="btn-group dropstart">
            <button
              type="button"
              className="btn btn-link btn-sm rounded-1 px-0 py-0 py-sm-1 me-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <ThreeDotsVertical className={`${styles.threeDots}`} />
            </button>
            <ul className="dropdown-menu">
              <li>
                <button type="button" className="dropdown-item btn btn-danger">
                  <strong className="text-danger">Leave room</strong>
                </button>
              </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
