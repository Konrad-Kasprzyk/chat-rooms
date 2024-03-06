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
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Stack from "react-bootstrap/esm/Stack";

export default function UserDropdownItem(props: { botNumber?: number }) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

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
    <Stack direction="horizontal" gap={3}>
      <div>{props.botNumber !== undefined ? `Bot ${props.botNumber + 1}` : "Main user"}</div>
      <Button onClick={() => switchUserIdBetweenLinkedBotIds(userId)}>Switch User</Button>
      <Dropdown>
        <Dropdown.Toggle size="sm" variant="outline-primary"></Dropdown.Toggle>
        <Dropdown.Menu align="end" style={{ maxWidth: "80vw" }}>
          <div>{username}</div>
          <div className="d-inline-block text-truncate">{email}</div>
          <Stack direction="horizontal" gap={3}>
            <Button onClick={() => addBotToWorkspace(userId)}>Add to room</Button>
            <Button onClick={() => inviteUserToWorkspace(email)}>Invite to room</Button>
          </Stack>
        </Dropdown.Menu>
      </Dropdown>
    </Stack>
  );
}
