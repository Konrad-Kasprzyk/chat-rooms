"use client";

import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import { useState } from "react";
import NewRoom from "./NewRoom";
import RoomList from "./RoomList";

export default function Rooms() {
  const [openTab, setOpenTab] = useState<"rooms" | "deletedRooms">("rooms");

  return (
    <div className={`vstack gap-3 justify-content-center mt-4`}>
      <NewRoom />
      <div
        className={`btn-group mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="rooms"
          autoComplete="off"
          defaultChecked
          onChange={() => setOpenTab("rooms")}
        />
        <label className="btn btn-outline-success" htmlFor="rooms">
          Rooms
        </label>
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="deletedRooms"
          autoComplete="off"
          onChange={() => setOpenTab("deletedRooms")}
        />
        <label className="btn btn-outline-success" htmlFor="deletedRooms">
          Deleted rooms
        </label>
      </div>
      <RoomList />
    </div>
  );
}
