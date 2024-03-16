"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import TabRadioButton from "client/components/TabRadioButton";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import User from "common/clientModels/user.model";
import Workspace from "common/clientModels/workspace.model";
import { useEffect, useState } from "react";
import OpeningRoom from "./OpeningRoom";
import RoomSettings from "./RoomSettings";

export default function Room({ params }: { params: { roomId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Workspace | null>(null);
  const [openTab, setOpenTab] = useState<"chat" | "members" | "invitations" | "room">("chat");

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
      className={`vstack overflow-auto gap-3 justify-content-center pt-4`}
      style={{ maxHeight: "100%" }}
    >
      <div className={`${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT}`}>
        <h3 className="mb-0 text-center text-truncate">{room.title}</h3>
        <div className="text-body-secondary text-center text-truncate">{room.description}</div>
      </div>
      <div
        className={`btn-group mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <TabRadioButton tab="chat" label="Chat" setOpenTab={setOpenTab} defaultChecked={true} />
        <TabRadioButton tab="members" label="Members" setOpenTab={setOpenTab} />
        <TabRadioButton tab="invitations" label="Invitations" setOpenTab={setOpenTab} />
        <TabRadioButton tab="room" label="Room" setOpenTab={setOpenTab} />
      </div>
      <RoomSettings openRoom={room} />
    </div>
  );
}
