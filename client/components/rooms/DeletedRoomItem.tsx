"use client";

import retrieveWorkspaceFromRecycleBin from "client/api/workspace/retrieveWorkspaceFromRecycleBin.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { memo, useEffect, useRef } from "react";

const DeletedRoomItem = memo(function DeletedRoomItem(props: {
  roomId: string;
  title: string;
  description: string;
  showPermanentlyDeleteRoomModal: (roomId: string) => void;
}) {
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const modalRoomRef = useRef<WorkspaceSummary | null>(null);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) => {
      roomsRef.current = nextRooms.docs;
      const nextModalRoom = nextRooms.docs.find((room) => room.id == props.roomId);
      modalRoomRef.current = nextModalRoom || null;
    });
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [props.roomId]);

  return (
    <li className="list-group-item vstack">
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
              if (modalRoomRef.current?.id !== props.roomId) return;
              retrieveWorkspaceFromRecycleBin(props.roomId);
              modalRoomRef.current.placingInBinTime = null;
              setNextWorkspaceSummaries(
                [...roomsRef.current],
                [{ type: "modified", doc: modalRoomRef.current }]
              );
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
