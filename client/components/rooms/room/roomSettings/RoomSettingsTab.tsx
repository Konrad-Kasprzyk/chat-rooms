import DEFAULT_SMALL_HORIZONTAL_ALIGNMENT from "client/constants/defaultSmallHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import { useState } from "react";
import RoomHistoryList from "./RoomHistoryList";
import RoomSettings from "./RoomSettings";

export default function RoomSettingsTab(props: { openRoom: Workspace }) {
  const [openTab, setOpenTab] = useState<"settings" | "history">("settings");

  return (
    <>
      <div
        className={`btn-group ${DEFAULT_SMALL_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="roomSettingsTab"
          id="roomSettingsTabSettings"
          autoComplete="off"
          onChange={() => setOpenTab("settings")}
          defaultChecked
        />
        <label className="btn btn-outline-secondary" htmlFor="roomSettingsTabSettings">
          Settings
        </label>
        <input
          type="radio"
          className="btn-check"
          name="roomSettingsTab"
          id="roomSettingsTabHistory"
          autoComplete="off"
          onChange={() => setOpenTab("history")}
        />
        <label className="btn btn-outline-secondary" htmlFor="roomSettingsTabHistory">
          History
        </label>
      </div>
      {openTab == "settings" ? <RoomSettings openRoom={props.openRoom} /> : null}
      {openTab == "history" ? <RoomHistoryList /> : null}
    </>
  );
}
