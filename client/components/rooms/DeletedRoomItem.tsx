"use client";

import retrieveWorkspaceFromRecycleBin from "client/api/workspace/retrieveWorkspaceFromRecycleBin.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import { memo, useEffect, useRef, useState } from "react";

const DeletedRoomItem = memo(function DeletedRoomItem(props: {
  roomId: string;
  title: string;
  description: string;
  showPermanentlyDeleteRoomModal: (roomId: string) => void;
}) {
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const [room, setRoom] = useState<WorkspaceSummary | null>(null);
  const [daysToPermanentDelete, setDaysToPermanentDelete] = useState<number | null>(null);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) => {
      roomsRef.current = nextRooms.docs;
      const nextRoom = nextRooms.docs.find((room) => room.id == props.roomId);
      setRoom(nextRoom ? { ...nextRoom } : null);
    });
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [props.roomId]);

  useEffect(() => {
    if (!room || !room.placingInBinTime) {
      setDaysToPermanentDelete(null);
      return;
    }
    const placingInBinMillis = room.placingInBinTime.getTime();
    const currentDateMillis = new Date().getTime();
    const millisInBin = currentDateMillis - placingInBinMillis;
    if (millisInBin <= 0) {
      setDaysToPermanentDelete(WORKSPACE_DAYS_IN_BIN - 1);
      return;
    }
    const daysInBin = Math.ceil(millisInBin / (1000 * 60 * 60 * 24));
    setDaysToPermanentDelete(WORKSPACE_DAYS_IN_BIN - daysInBin);
  }, [room]);

  return (
    <li className="list-group-item vstack">
      {daysToPermanentDelete !== null ? (
        <span className="text-danger text-center">
          {daysToPermanentDelete <= 1
            ? `1 day to permanent delete`
            : `${daysToPermanentDelete} days to permanent delete`}
        </span>
      ) : null}
      <h5 className="mb-0 mt-1 text-center text-truncate">{props.title}</h5>
      <small className="text-body-secondary text-center text-truncate">{props.description}</small>
      <div className="mb-1 mt-2 hstack justify-content-around">
        <div className="col-6 d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-danger ms-sm-auto me-2 me-sm-4 me-xxl-5"
            onClick={() => props.showPermanentlyDeleteRoomModal(props.roomId)}
          >
            Permanent delete room
          </button>
        </div>
        <div className="col-6 d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary me-sm-auto ms-2 ms-sm-4 ms-xxl-5"
            onClick={() => {
              if (room?.id !== props.roomId) return;
              retrieveWorkspaceFromRecycleBin(props.roomId);
              room.placingInBinTime = null;
              setNextWorkspaceSummaries([...roomsRef.current], [{ type: "modified", doc: room }]);
            }}
          >
            Restore room
          </button>
        </div>
      </div>
    </li>
  );
});

export default DeletedRoomItem;
