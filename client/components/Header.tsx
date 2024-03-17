"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
import { useCookies } from "react-cookie";
import UserDropdown from "./UserDropdown";
import styles from "./header.module.scss";

export default function Header(props: { serverTheme: "light" | "dark" }) {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(props.serverTheme);
  const { push } = useRouter();
  const [cookies, setCookie] = useCookies(["theme"]);

  const setThemeCookie = useCallback(
    (newTheme: "light" | "dark") => {
      const secondsInYear = 365 * 24 * 60 * 60;
      const yearAheadDate = new Date(new Date().getTime() + secondsInYear * 1000);
      setCookie("theme", newTheme, {
        sameSite: "strict",
        secure: true,
        maxAge: secondsInYear,
        expires: yearAheadDate,
      });
    },
    [setCookie]
  );

  useEffect(() => {
    if (!cookies.theme) {
      setThemeCookie(theme);
      return;
    }
    const themeFromCookie: "light" | "dark" = cookies.theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", themeFromCookie);
    setTheme(themeFromCookie);
  }, [cookies, theme, setThemeCookie]);

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
    <div className="hstack gap-1 align-items-center mt-1 mx-0 mx-sm-3">
      <a
        role="button"
        href="/"
        className="btn btn-link btn-sm"
        onClick={linkHandler("/", push)}
      >
        <HouseDoor className={styles.outermostIcon} />
      </a>
      {isUserSigned ? (
        <div className="hstack ms-sm-4 ms-lg-5">
          <a
            role="button"
            className="btn btn-link btn-sm me-1 me-sm-4 me-lg-5"
            style={{ textDecoration: "none" }}
            href="/rooms"
            onClick={linkHandler("/rooms", push)}
          >
            <strong className={styles.navLinkText}>Rooms</strong>
          </a>
          <a
            role="button"
            className="btn btn-link btn-sm"
            style={{ textDecoration: "none" }}
            href="/invitations"
            onClick={linkHandler("/invitations", push)}
          >
            <strong className={styles.navLinkText}>Invitations</strong>
          </a>
        </div>
      ) : null}
      <div className="hstack ms-auto">
        {theme === "dark" ? (
          <button
            type="button"
            className={`${styles.darkModeButton} btn btn-link btn-sm me-sm-2 me-md-3`}
            style={{ textDecoration: "none" }}
            onClick={() => setThemeCookie("light")}
          >
            <Moon className={styles.darkModeIcon} />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.darkModeButton} btn btn-link btn-sm me-sm-2 me-md-3`}
            style={{ textDecoration: "none" }}
            onClick={() => setThemeCookie("dark")}
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
