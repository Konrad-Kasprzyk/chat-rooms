import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import { useState } from "react";

export default function RoomUsersTab(props: { openRoom: Workspace }) {
  const [openTab, setOpenTab] = useState<"members" | "invitations" | "history">("members");

  return (
    <>
      <div
        className={`btn-group ${DEFAULT_HORIZONTAL_ALIGNMENT} px-5`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="roomUsersTab"
          id="roomUsersTabMembers"
          autoComplete="off"
          onChange={() => setOpenTab("members")}
          defaultChecked
        />
        <label className="btn btn-outline-secondary" htmlFor="roomUsersTabMembers">
          Members
        </label>
        <input
          type="radio"
          className="btn-check"
          name="roomUsersTab"
          id="roomUsersTabInvitations"
          autoComplete="off"
          onChange={() => setOpenTab("invitations")}
        />
        <label className="btn btn-outline-secondary" htmlFor="roomUsersTabInvitations">
          Invitations
        </label>
        <input
          type="radio"
          className="btn-check"
          name="roomUsersTab"
          id="roomUsersTabHistory"
          autoComplete="off"
          onChange={() => setOpenTab("history")}
        />
        <label className="btn btn-outline-secondary" htmlFor="roomUsersTabHistory">
          History
        </label>
      </div>
      <div> room users tab </div>
    </>
  );
}
