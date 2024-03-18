"use client";

import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import { useState } from "react";
import NewRoom from "../../client/components/rooms/NewRoom";
import RoomList from "../../client/components/rooms/RoomList";

export default function Rooms() {
  const [openTab, setOpenTab] = useState<"rooms" | "deletedRooms">("rooms");

  return (
    <div className={`vstack gap-3 justify-content-center pt-4`} style={{ maxHeight: "100%" }}>
      <NewRoom />
      <div
        className={`btn-group mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
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
      <div className="d-flex mb-sm-3 mb-md-4" style={{ minHeight: "0" }}>
        <RoomList />
      </div>
    </div>
  );
}
