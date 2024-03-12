"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
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
    <div className="hstack d-flex justify-content-between align-items-center mt-1 mx-0 mx-sm-3">
      <a
        role="button"
        href="/"
        className="btn btn-link btn-sm"
        onClick={linkHandler("/", push)}
      >
        <HouseDoor
          color="black"
          className={styles.outermostIcon}
        />
      </a>
      {isUserSigned ? (
        <div className="hstack ps-sm-5">
          <a
            role="button"
            className="btn btn-link btn-sm me-1 me-sm-5"
            style={{ textDecoration: "none" }}
            href="/rooms"
            onClick={linkHandler("/rooms", push)}
          >
            <strong className={styles.navLinkText}>Rooms</strong>
          </a>
          <a
            role="button"
            className="btn btn-link btn-sm me-1 me-sm-5"
            style={{ textDecoration: "none" }}
            href="/invitations"
            onClick={linkHandler("/invitations", push)}
          >
            <strong className={styles.navLinkText}>Invitations</strong>
          </a>
        </div>
      ) : null}
      <div className="hstack">
        {darkMode ? (
          <button
            type="button"
            className={`${styles.darkModeButton} btn btn-link btn-sm me-sm-2 me-md-3`}
            style={{ textDecoration: "none" }}
            onClick={() => setDarkMode(false)}
          >
            <Moon
              color="black"
              className={styles.darkModeIcon}
            />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.darkModeButton} btn btn-link btn-sm me-sm-2 me-md-3`}
            style={{ textDecoration: "none" }}
            onClick={() => setDarkMode(true)}
          >
            <Sun
              color="black"
              className={styles.darkModeIcon}
            />
          </button>
        )}
        {isUserSigned ? (
          <UserDropdown />
        ) : (
          <a
            role="button"
            href="/rooms"
            className="btn btn-primary mx-1 mx-sm-0"
            onClick={linkHandler("/signin", push)}
          >
            <div className={styles.signInButtonText}>Sign In</div>
          </a>
        )}
      </div>
    </div>
  );
}
