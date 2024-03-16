"use client";

import TabRadioButton from "client/components/TabRadioButton";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import { useState } from "react";
import NewRoom from "./NewRoom";
import RoomList from "./RoomList";

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
        <TabRadioButton tab="rooms" label="Rooms" setOpenTab={setOpenTab} defaultChecked={true} />
        <TabRadioButton tab="deletedRooms" label="Deleted rooms" setOpenTab={setOpenTab} />
      </div>
      <div className="d-flex mb-sm-3 mb-md-4" style={{ minHeight: "0" }}>
        <RoomList />
      </div>
    </div>
  );
}
