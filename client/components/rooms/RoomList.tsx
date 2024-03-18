"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import setNewRoomsIfVisibleChange from "client/utils/components/setNewRoomsIfVisibleChange.util";
import User from "common/clientModels/user.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { useCallback, useEffect, useRef, useState } from "react";
import RoomItem from "./RoomItem";
import LeaveRoomModal from "./room/LeaveRoomModal";

export default function RoomList() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<WorkspaceSummary[]>([]);
  const [modalRoomId, setModalRoomId] = useState<string>("");
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    const userSubscription = listenCurrentUser().subscribe((user) => setUser(user));
    return () => userSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) =>
      setNewRoomsIfVisibleChange(
        rooms,
        user
          ? nextRooms.docs.filter(
              (room) => room.placingInBinTime === null && room.userIds.includes(user.id)
            )
          : [],
        setRooms
      )
    );
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [user, rooms]);

  const showLeaveRoomModal = useCallback((roomId: string) => {
    if (!modalButtonRef.current) return;
    setModalRoomId(roomId);
    modalButtonRef.current.click();
  }, []);

  return (
    <>
      <ul
        className={`list-group list-group-flush overflow-auto ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}
      >
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
