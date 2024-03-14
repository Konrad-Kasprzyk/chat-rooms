"use client";

import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import NewRoom from "./NewRoom";

export default function Rooms() {
  return (
    <div className={`vstack gap-3 justify-content-center ${DEFAULT_HORIZONTAL_ALIGNMENT} mt-4`}>
      <NewRoom />
    </div>
  );
}
