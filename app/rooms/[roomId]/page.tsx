"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import RoomChat from "client/components/rooms/room/roomChat/RoomChat";
import RoomSettingsTab from "client/components/rooms/room/roomSettings/RoomSettingsTab";
import RoomUsersTab from "client/components/rooms/room/roomUsers/RoomUsersTab";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import User from "common/clientModels/user.model";
import Workspace from "common/clientModels/workspace.model";
import { useEffect, useState } from "react";
import OpeningRoom from "../../../client/components/rooms/room/OpeningRoom";

export default function Room({ params }: { params: { roomId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Workspace | null>(null);
  const [openTab, setOpenTab] = useState<"chat" | "users" | "room">("chat");

  useEffect(() => {
    return () => setOpenWorkspaceId(null);
  }, []);

  useEffect(() => {
    setOpenWorkspaceId(params.roomId);
  }, [params.roomId]);

  useEffect(() => {
    const userSubscription = listenCurrentUser().subscribe((user) => setUser(user));
    return () => userSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((openRoom) => setRoom(openRoom));
    return () => openRoomSubscription.unsubscribe();
  }, []);

  return !room ? (
    <OpeningRoom roomId={params.roomId} />
  ) : (
    <div
      className={`vstack overflow-auto gap-3 gap-md-4 justify-content-center pt-2 pt-sm-3 pt-md-4`}
      style={{ maxHeight: "100%" }}
    >
      <div className={`${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}>
        <h3 className="mb-0 text-center text-truncate">{room.title}</h3>
        <div className="text-body-secondary text-center text-truncate">{room.description}</div>
      </div>
      <div
        className={`btn-group ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="roomPage"
          id="roomPageChat"
          autoComplete="off"
          onChange={() => setOpenTab("chat")}
          defaultChecked
        />
        <label className="btn btn-outline-success" htmlFor="roomPageChat">
          Chat
        </label>
        <input
          type="radio"
          className="btn-check"
          name="roomPage"
          id="roomPageUsers"
          autoComplete="off"
          onChange={() => setOpenTab("users")}
        />
        <label className="btn btn-outline-success" htmlFor="roomPageUsers">
          Users
        </label>
        <input
          type="radio"
          className="btn-check"
          name="roomPage"
          id="roomPageRoom"
          autoComplete="off"
          onChange={() => setOpenTab("room")}
        />
        <label className="btn btn-outline-success" htmlFor="roomPageRoom">
          Room
        </label>
      </div>
      {openTab == "chat" ? <RoomChat openRoom={room} /> : null}
      {openTab == "users" ? <RoomUsersTab openRoom={room} /> : null}
      {openTab == "room" ? <RoomSettingsTab openRoom={room} /> : null}
    </div>
  );
}