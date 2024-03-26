"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import setNewRoomsIfVisibleChange from "client/utils/components/setNewRoomsIfVisibleChange.util";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { useCallback, useEffect, useRef, useState } from "react";
import RoomItem from "./RoomItem";
import LeaveRoomModal from "./room/LeaveRoomModal";

export default function RoomList() {
  const [signedInUserId, setSignedInUserId] = useState<string | null>(getSignedInUserId());
  const [rooms, setRooms] = useState<WorkspaceSummary[]>([]);
  const [modalRoomId, setModalRoomId] = useState<string>("");
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const userSubscription = listenSignedInUserIdChanges().subscribe((userId) =>
      setSignedInUserId(userId)
    );
    return () => userSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) =>
      setNewRoomsIfVisibleChange(
        rooms,
        signedInUserId
          ? nextRooms.docs.filter(
              (room) => room.placingInBinTime === null && room.userIds.includes(signedInUserId)
            )
          : [],
        setRooms
      )
    );
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [signedInUserId, rooms]);

  const showLeaveRoomModal = useCallback((roomId: string) => {
    if (!modalButtonRef.current) return;
    setModalRoomId(roomId);
    modalButtonRef.current.click();
  }, []);

  return (
    <>
      <ul className={`list-group list-group-flush ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}>
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            id={room.id}
            title={room.title}
            description={room.description}
            showLeaveRoomModal={showLeaveRoomModal}
          />
        ))}
      </ul>
      <LeaveRoomModal
        roomId={modalRoomId}
        hidden={true}
        ref={modalButtonRef}
        modalIdPrefix="roomList"
      />
    </>
  );
}
