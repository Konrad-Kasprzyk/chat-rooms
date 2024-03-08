"use client";

import useWindowDimensions from "app/hooks/useWindowDimensions.hook";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import BOOTSTRAP_BREAKPOINTS from "client/constants/bootstrapBreakpoints.constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { height, width } = useWindowDimensions();
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
      <Button size="sm" variant="outline-primary" onClick={() => push("/")}>
        <HouseDoor color="black" size={width < BOOTSTRAP_BREAKPOINTS.sm ? 30 : 40} />
      </Button>
      <Stack direction="horizontal" className="mx-1 mx-sm-5">
        <Button
          size="sm"
          className="me-1 me-sm-5"
          variant="link"
          style={{
            fontSize: width < BOOTSTRAP_BREAKPOINTS.sm ? "15px" : "20px",
            textDecoration: "none",
          }}
          onClick={() => push("/rooms")}
        >
          <strong>Rooms</strong>
        </Button>
        <Button
          size="sm"
          variant="link"
          style={{
            fontSize: width < BOOTSTRAP_BREAKPOINTS.sm ? "15px" : "20px",
            textDecoration: "none",
          }}
          onClick={() => push("/invitations")}
        >
          <strong>Invitations</strong>
        </Button>
      </Stack>
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
