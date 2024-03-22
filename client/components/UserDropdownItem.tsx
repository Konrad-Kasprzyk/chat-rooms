"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace, {
  setNextOpenWorkspace,
} from "client/api/workspace/listenOpenWorkspace.api";
import Workspace from "common/clientModels/workspace.model";
import getBotEmail from "common/utils/getBotEmail.util";
import getBotId from "common/utils/getBotId.util";
import getBotUsername from "common/utils/getBotUsername.util";
import getMainUserEmail from "common/utils/getMainUserEmail.util";
import getMainUserId from "common/utils/getMainUserId.util";
import getMainUserUsername from "common/utils/getMainUserUsername.util";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CopyIcon from "./CopyIcon";
import TruncatedEmail from "./TruncatedEmail";

export default function UserDropdownItem(props: { botNumber?: number }) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [openRoom, setOpenRoom] = useState<Workspace | null>(null);
  const [addBotButtonDisabled, setAddBotButtonDisabled] = useState(true);
  const [inviteBotButtonDisabled, setInviteBotButtonDisabled] = useState(true);
  const [addBotUnderButtonText, setAddBotUnderButtonText] = useState("");
  const [inviteBotUnderButtonText, setInviteBotUnderButtonText] = useState("");

  const hideEmailCopiedBadgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const { push } = useRouter();

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((openRoom) =>
      setOpenRoom(openRoom)
    );
    return () => openRoomSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (hideEmailCopiedBadgeTimeoutRef.current) {
        clearTimeout(hideEmailCopiedBadgeTimeoutRef.current);
        hideEmailCopiedBadgeTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const signedInUserSubscription = listenCurrentUser().subscribe((user) => {
      if (!user) {
        setUserId("");
        setUsername("");
        setEmail("");
        return;
      }
      const mainUserId = user.isBotUserDocument ? getMainUserId(user.id) : user.id;
      const mainUserUsername = user.isBotUserDocument
        ? getMainUserUsername(user.username)
        : user.username;
      const mainUserEmail = user.isBotUserDocument ? getMainUserEmail(mainUserId) : user.email;
      if (props.botNumber !== undefined) {
        const botId = getBotId(mainUserId, props.botNumber);
        const botUsername = getBotUsername(mainUserUsername, props.botNumber);
        const botEmail = getBotEmail(botId);
        if (userId != botId) setUserId(botId);
        if (username != botUsername) setUsername(botUsername);
        if (email != botEmail) setEmail(botEmail);
      } else {
        if (userId != mainUserId) setUserId(mainUserId);
        if (username != mainUserUsername) setUsername(mainUserUsername);
        if (email != mainUserEmail) setEmail(mainUserEmail);
      }
    });
    return () => {
      signedInUserSubscription.unsubscribe();
    };
  }, [userId, username, email, props.botNumber]);

  useEffect(() => {
    if (!openRoom) {
      setAddBotButtonDisabled(true);
      setInviteBotButtonDisabled(true);
      setAddBotUnderButtonText("first open room");
      setInviteBotUnderButtonText("first open room");
      return;
    }
    if (openRoom.userIds.includes(userId)) {
      setAddBotButtonDisabled(true);
      setInviteBotButtonDisabled(true);
      setAddBotUnderButtonText("already belongs");
      setInviteBotUnderButtonText("already belongs");
      return;
    }
    setAddBotButtonDisabled(false);
    setAddBotUnderButtonText("");
    if (openRoom.invitedUserEmails.includes(email)) {
      setInviteBotButtonDisabled(true);
      setInviteBotUnderButtonText("already invited");
      return;
    }
    setInviteBotButtonDisabled(false);
    setInviteBotUnderButtonText("");
  }, [userId, email, openRoom]);

  return (
    <div className="hstack gap-3 justify-content-between">
      <div className="col-4">
        <div>{props.botNumber !== undefined ? `Bot ${props.botNumber + 1}` : "Main user"}</div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          if (openRoom && openRoom.userIds.every((belongingUserId) => belongingUserId != userId))
            push("/rooms");
          switchUserIdBetweenLinkedBotIds(userId);
        }}
      >
        Switch User
      </button>
      <div className="dropdown">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm dropdown-toggle"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          aria-expanded="false"
        ></button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          style={{ width: "calc(min(350px,100vw) - 16px)" }}
          ref={dropdownMenuRef}
        >
          <li className="text-center text-truncate">{username}</li>
          <li className="hstack justify-content-center">
            <div className="ps-1" style={{ maxWidth: "calc(100% - 32px)" }}>
              <TruncatedEmail
                email={email}
                containerToObserveWidthChanges={dropdownMenuRef.current}
                textClassName="small"
              />
            </div>
            <div className="mx-2">
              <CopyIcon textToCopy={email} popupDirection="bottom" />
            </div>
          </li>
          <li className="hstack gap-3 mt-2 justify-content-around">
            <div className="vstack flex-grow-0">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  if (!openRoom) return;
                  addBotToWorkspace(userId);
                  setTimeout(() => {
                    setNextOpenWorkspace({ ...openRoom, userIds: [...openRoom.userIds, userId] });
                  }, 0);
                }}
                disabled={addBotButtonDisabled}
              >
                Add to room
              </button>
              <small className="text-center text-secondary">{addBotUnderButtonText}</small>
            </div>
            <div>
              <div className="vstack flex-grow-0">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    if (!openRoom) return;
                    inviteUserToWorkspace(email);
                    setNextOpenWorkspace({
                      ...openRoom,
                      invitedUserEmails: [...openRoom.invitedUserEmails, email],
                    });
                  }}
                  disabled={inviteBotButtonDisabled}
                >
                  Invite to room
                </button>
                <small className="text-center text-secondary">{inviteBotUnderButtonText}</small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
