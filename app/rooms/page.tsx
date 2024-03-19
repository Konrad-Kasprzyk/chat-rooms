"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import User from "common/clientModels/user.model";
import { useEffect, useRef, useState } from "react";
import NewRoom from "../../client/components/rooms/NewRoom";
import RoomList from "../../client/components/rooms/RoomList";

export default function Rooms() {
  const [user, setUser] = useState<User | null>(null);
  const [openTab, setOpenTab] = useState<"rooms" | "deletedRooms">("rooms");
  const newRoomModalButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentUserSubscription = listenCurrentUser().subscribe((nextUser) => setUser(nextUser));
    return () => currentUserSubscription.unsubscribe();
  }, []);

  return (
    <div className={`vstack gap-3 justify-content-center pt-4`} style={{ maxHeight: "100%" }}>
      <NewRoom ref={newRoomModalButton} />
      <div
        className={`btn-group d-flex mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="roomList"
            id="roomListRooms"
            autoComplete="off"
            onChange={() => setOpenTab("rooms")}
            defaultChecked
          />
          <label className="btn btn-outline-success" htmlFor="roomListRooms">
            Rooms
          </label>
        </div>
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="roomList"
            id="roomListDeletedRooms"
            autoComplete="off"
            onChange={() => setOpenTab("deletedRooms")}
          />
          <label className="btn btn-outline-success" htmlFor="roomListDeletedRooms">
            Deleted rooms
          </label>
        </div>
      </div>
      {user && user.workspaceIds.length == 0 ? (
        <button
          type="button"
          className="btn btn-primary btn-lg mx-auto"
          style={{ marginTop: "15vh" }}
          onClick={() => {
            if (newRoomModalButton.current) newRoomModalButton.current.click();
          }}
        >
          Create first room
        </button>
      ) : (
        <div className="d-flex mb-sm-3 mb-md-4" style={{ minHeight: "0" }}>
          <RoomList />
        </div>
      )}
    </div>
  );
}
