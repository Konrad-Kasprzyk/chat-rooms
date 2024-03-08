"use client";

import useWindowSize from "app/hooks/useWindowSize.hook";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import BOOTSTRAP_BREAKPOINTS from "client/constants/bootstrapBreakpoints.constant";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { width } = useWindowSize();
  const { push } = useRouter();

  useEffect(() => {
    const signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe((userId) => {
      const isUserIdSet = Boolean(userId);
      if (isUserSigned != isUserIdSet) setIsUserSigned(isUserIdSet);
    });

    const isUserIdSet = Boolean(getSignedInUserId());
    if (isUserSigned != isUserIdSet) setIsUserSigned(isUserIdSet);

    return () => {
      signedInUserIdChangesSubscription.unsubscribe();
    };
  }, [isUserSigned]);

  return (
    <Stack
      direction="horizontal"
      className="d-flex justify-content-between align-items-center mt-1 mx-0 mx-sm-3"
    >
      <Button size="sm" variant="link" href="/" onClick={linkHandler("/", push)}>
        <HouseDoor color="black" size={width < BOOTSTRAP_BREAKPOINTS.sm ? 30 : 40} />
      </Button>
      {isUserSigned ? (
        <Stack direction="horizontal" className="ps-sm-5">
          <Button
            size="sm"
            className="me-1 me-sm-5"
            variant="link"
            href="/rooms"
            style={{
              fontSize: width < BOOTSTRAP_BREAKPOINTS.sm ? "15px" : "20px",
              textDecoration: "none",
            }}
            onClick={linkHandler("/rooms", push)}
          >
            <strong>Rooms</strong>
          </Button>
          <Button
            size="sm"
            variant="link"
            href="/invitations"
            style={{
              fontSize: width < BOOTSTRAP_BREAKPOINTS.sm ? "15px" : "20px",
              textDecoration: "none",
            }}
            onClick={linkHandler("/invitations", push)}
          >
            <strong>Invitations</strong>
          </Button>
        </Stack>
      ) : null}
      <Stack direction="horizontal" gap={width < BOOTSTRAP_BREAKPOINTS.sm ? 0 : 3}>
        {darkMode ? (
          <Button
            size="sm"
            variant="link"
            style={{
              textDecoration: "none",
              padding: width < BOOTSTRAP_BREAKPOINTS.sm ? "4px" : undefined,
            }}
          >
            <Moon
              color="black"
              onClick={() => setDarkMode(false)}
              size={width < BOOTSTRAP_BREAKPOINTS.sm ? 25 : 30}
            />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="link"
            style={{
              textDecoration: "none",
              padding: width < BOOTSTRAP_BREAKPOINTS.sm ? "4px" : undefined,
            }}
          >
            <Sun
              color="black"
              onClick={() => setDarkMode(true)}
              size={width < BOOTSTRAP_BREAKPOINTS.sm ? 25 : 30}
            />
          </Button>
        )}
        {isUserSigned ? <UserDropdown /> : <Button onClick={() => push("/signin")}>Sign In</Button>}
      </Stack>
    </Stack>
  );
}
