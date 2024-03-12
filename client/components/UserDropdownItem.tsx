"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import getBotEmail from "common/utils/getBotEmail.util";
import getBotId from "common/utils/getBotId.util";
import getBotUsername from "common/utils/getBotUsername.util";
import getMainUserEmail from "common/utils/getMainUserEmail.util";
import getMainUserId from "common/utils/getMainUserId.util";
import getMainUserUsername from "common/utils/getMainUserUsername.util";
import { useEffect, useRef, useState } from "react";

export default function UserDropdownItem(props: { botNumber?: number }) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const hideEmailCopiedBadgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setHideEmailCopiedBadgeTimeout() {
    if (hideEmailCopiedBadgeTimeoutRef.current)
      clearTimeout(hideEmailCopiedBadgeTimeoutRef.current);
    hideEmailCopiedBadgeTimeoutRef.current = setTimeout(() => {
      setEmailCopied(false);
    }, 1500);
  }

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

  return (
    <div className="hstack gap-3 justify-content-between">
      <div className="col-4">
        <div>{props.botNumber !== undefined ? `Bot ${props.botNumber + 1}` : "Main user"}</div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => switchUserIdBetweenLinkedBotIds(userId)}
      >
        Switch User
      </button>
      <div className="dropdown">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm dropdown-toggle"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          onClick={() => setEmailCopied(false)}
          aria-expanded="false"
        ></button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          style={{ width: "calc(min(350px,100vw) - 16px)" }}
        >
          <li className="text-center">{username}</li>
          <li className="hstack justify-content-center">
            {props.botNumber !== undefined ? <div>bot{props.botNumber + 1}</div> : null}
            <div
              className="text-truncate text-center"
              style={{ direction: "rtl" }}
            >
              {email}
            </div>
          </li>
          <li className="d-flex justify-content-end align-items-center">
            {emailCopied ? <span className="badge text-bg-secondary me-2 mt-1">Copied</span> : null}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={() => {
                navigator.clipboard.writeText(email);
                setEmailCopied(true);
                setHideEmailCopiedBadgeTimeout();
              }}
            >
              Copy email
            </button>
          </li>
          <li className="hstack gap-3 mt-2 justify-content-around">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addBotToWorkspace(userId)}
            >
              Add to room
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => inviteUserToWorkspace(email)}
            >
              Invite to room
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
