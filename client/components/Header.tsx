"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import UserDropdown from "./UserDropdown";
import styles from "./header.module.scss";

export default function Header() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
        <HouseDoor color="black" className={styles.outermostIcon} />
      </Button>
      {isUserSigned ? (
        <Stack direction="horizontal" className="ps-sm-5">
          <Button
            size="sm"
            className="me-1 me-sm-5"
            variant="link"
            href="/rooms"
            style={{
              textDecoration: "none",
            }}
            onClick={linkHandler("/rooms", push)}
          >
            <strong className={styles.navLink}>Rooms</strong>
          </Button>
          <Button
            size="sm"
            variant="link"
            href="/invitations"
            style={{
              textDecoration: "none",
            }}
            onClick={linkHandler("/invitations", push)}
          >
            <strong className={styles.navLink}>Invitations</strong>
          </Button>
        </Stack>
      ) : null}
      <Stack direction="horizontal">
        {darkMode ? (
          <Button size="sm" variant="link" className={`${styles.darkModeButton} me-sm-2 me-md-3`}>
            <Moon
              color="black"
              onClick={() => setDarkMode(false)}
              className={styles.darkModeIcon}
            />
          </Button>
        ) : (
          <Button variant="link" className={`${styles.darkModeButton} me-sm-2 me-md-3`}>
            <Sun color="black" onClick={() => setDarkMode(true)} className={styles.darkModeIcon} />
          </Button>
        )}
        {isUserSigned ? (
          <UserDropdown />
        ) : (
          <Button className="mx-1 mx-sm-0" onClick={() => push("/signin")}>
            <div className={styles.signInButtonText}>Sign In</div>
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
