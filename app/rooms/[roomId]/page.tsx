"use client";

import listenChatHistoryRecords from "client/api/history/chatHistory/listenChatHistoryRecords.api";
import {
  getHistoryListenerState,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenUsersHistoryRecords from "client/api/history/usersHistory/listenUsersHistoryRecords.api";
import listenWorkspaceHistoryRecords from "client/api/history/workspaceHistory/listenWorkspaceHistoryRecords.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import RoomChat from "client/components/rooms/room/roomChat/RoomChat";
import RoomSettingsTab from "client/components/rooms/room/roomSettings/RoomSettingsTab";
import RoomUsersTab from "client/components/rooms/room/roomUsers/RoomUsersTab";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import { useEffect, useState } from "react";
import OpeningRoom from "../../../client/components/rooms/room/OpeningRoom";

export default function Room({ params }: { params: { roomId: string } }) {
  const [room, setRoom] = useState<Workspace | null>(null);
  const [openTab, setOpenTab] = useState<"chat" | "users" | "room">("chat");

  useEffect(() => {
    return () => setOpenWorkspaceId(null);
  }, []);

  /**
   * Set history listener filters only if they are not already set. This prevents overriding actual
   * history listener filters, which could cause loading additional unwanted history records chunk
   * or cancel loading history records chunk.
   */
  useEffect(() => {
    setOpenWorkspaceId(params.roomId);
    const chatHistoryFilters = getHistoryListenerState()?.["ChatHistory"];
    if (!chatHistoryFilters)
      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
    listenChatHistoryRecords();
    const usersHistoryFilters = getHistoryListenerState()?.["UsersHistory"];
    if (!usersHistoryFilters)
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
    listenUsersHistoryRecords();
    const workspaceHistoryFilters = getHistoryListenerState()?.["WorkspaceHistory"];
    if (!workspaceHistoryFilters)
      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
    listenWorkspaceHistoryRecords();
  }, [params.roomId]);

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((openRoom) => setRoom(openRoom));
    return () => openRoomSubscription.unsubscribe();
  }, []);

  return !room ? (
    <OpeningRoom roomId={params.roomId} />
  ) : (
    <div className={`vstack gap-3 gap-md-4 pt-2 pt-sm-3 pt-md-4 h-100`}>
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
        <label className="btn btn-outline-primary" htmlFor="roomPageChat">
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
        <label className="btn btn-outline-primary" htmlFor="roomPageUsers">
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
        <label className="btn btn-outline-primary" htmlFor="roomPageRoom">
          Room
        </label>
      </div>
      {openTab == "chat" ? <RoomChat /> : null}
      {openTab == "users" ? <RoomUsersTab /> : null}
      {openTab == "room" ? <RoomSettingsTab /> : null}
    </div>
  );
}
