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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Stack from "react-bootstrap/esm/Stack";

export default function UserDropdownItem(props: { botNumber?: number }) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const componentRef = useRef<HTMLSpanElement>(null);
  const [componentWidth, setComponentWidth] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
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

  useLayoutEffect(() => {
    if (componentRef.current && componentRef.current.offsetWidth != componentWidth)
      setComponentWidth(componentRef.current.offsetWidth);
  }, [componentWidth, showDropdown]);

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
    <Stack direction="horizontal" gap={3} className="justify-content-between" ref={componentRef}>
      <Col xs={4}>
        <div>{props.botNumber !== undefined ? `Bot ${props.botNumber + 1}` : "Main user"}</div>
      </Col>
      <Button onClick={() => switchUserIdBetweenLinkedBotIds(userId)}>Switch User</Button>
      <Dropdown
        onToggle={(nextShow: boolean) => {
          setShowDropdown(nextShow);
          setEmailCopied(false);
        }}
      >
        <Dropdown.Toggle size="sm" variant="outline-primary"></Dropdown.Toggle>
        <Dropdown.Menu align="end" style={componentWidth ? { width: `${componentWidth}px` } : {}}>
          <div className="text-center">{username}</div>
          <Stack direction="horizontal" className="justify-content-center">
            {props.botNumber !== undefined ? <div>bot{props.botNumber + 1}</div> : null}
            <div className="text-truncate text-center" style={{ direction: "rtl" }}>
              {email}
            </div>
          </Stack>
          <div className="d-flex justify-content-end align-items-center">
            {emailCopied ? (
              <Badge bg="secondary" className="me-2 mt-1">
                Copied
              </Badge>
            ) : null}
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => {
                navigator.clipboard.writeText(email);
                setEmailCopied(true);
                setHideEmailCopiedBadgeTimeout();
              }}
            >
              Copy email
            </Button>
          </div>
          <Stack direction="horizontal" gap={3} className="mt-2 justify-content-around">
            <Button onClick={() => addBotToWorkspace(userId)}>Add to room</Button>
            <Button onClick={() => inviteUserToWorkspace(email)}>Invite to room</Button>
          </Stack>
        </Dropdown.Menu>
      </Dropdown>
    </Stack>
  );
}
