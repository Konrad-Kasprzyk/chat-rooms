"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import setNewRoomsIfVisibleChange from "client/utils/components/setNewRoomsIfVisibleChange.util";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import DeletedRoomItem from "./DeletedRoomItem";
import PermanentDeleteRoomModal from "./PermanentDeleteRoomModal";

export default function DeletedRoomList() {
  const [signedInUserId, setSignedInUserId] = useState<string | null>(getSignedInUserId());
  const [rooms, setRooms] = useState<WorkspaceSummary[]>([]);
  const [modalRoomId, setModalRoomId] = useState<string>("");
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const userSubscription = listenSignedInUserIdChanges().subscribe((userId) =>
      setSignedInUserId(userId)
    );
    return () => userSubscription.unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) => {
      const oldestPlacingInBinDateToShow = new Date(
        new Date().getTime() - WORKSPACE_DAYS_IN_BIN * 24 * 60 * 60 * 1000
      );
      setNewRoomsIfVisibleChange(
        rooms,
        signedInUserId
          ? nextRooms.docs.filter(
              (room) =>
                room.placingInBinTime !== null &&
                room.userIds.includes(signedInUserId) &&
                room.placingInBinTime > oldestPlacingInBinDateToShow
            )
          : [],
        setRooms
      );
    });
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [signedInUserId, rooms]);

  const showPermanentlyDeleteRoomModal = useCallback((roomId: string) => {
    if (!modalButtonRef.current) return;
    setModalRoomId(roomId);
    modalButtonRef.current.click();
  }, []);

  return (
    <>
      {rooms.length == 0 ? (
        <div className="mt-5">
          <h4 className="text-center">No deleted rooms to restore</h4>
        </div>
      ) : (
        <>
          <ul className={`list-group ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}>
            {rooms.map((room) => (
              <DeletedRoomItem
                key={room.id}
                roomId={room.id}
                title={room.title}
                description={room.description}
                showPermanentlyDeleteRoomModal={showPermanentlyDeleteRoomModal}
              />
            ))}
          </ul>
          <PermanentDeleteRoomModal roomId={modalRoomId} ref={modalButtonRef} />
        </>
      )}
    </>
  );
}
