"use client";

import type { Popover } from "bootstrap";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HouseDoor, Moon, Sun } from "react-bootstrap-icons";
import { useCookies } from "react-cookie";
import UserDropdown from "./UserDropdown";
import styles from "./header.module.scss";

let popoverObject: Popover | null = null;

export function showFirstSignInPopover() {
  if (!popoverObject) return;

  function hideFirstSignInPopover() {
    if (!popoverObject) return;
    // Prevents scrollbar flickering when clicking on the user account icon.
    popoverObject.update();
    popoverObject.hide();
    document.removeEventListener("click", hideFirstSignInPopover);
  }

  document.addEventListener("click", hideFirstSignInPopover);
  popoverObject.show();
}

export default function Header(props: { serverTheme: "light" | "dark" }) {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(props.serverTheme);
  const pathname = usePathname();
  const { push } = useRouter();
  const [cookies, setCookie] = useCookies(["theme"]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore: This is a valid path for Bootstrap javascript
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      if (!popoverRef.current) {
        console.error("Popover reference for first sign in is null");
        return;
      }
      popoverObject = new bootstrap.Popover(popoverRef.current);
    });
  }, []);

  const setThemeCookie = useCallback(
    (newTheme: "light" | "dark") => {
      const secondsInYear = 365 * 24 * 60 * 60;
      const yearAheadDate = new Date(new Date().getTime() + secondsInYear * 1000);
      setCookie("theme", newTheme, {
        path: "/",
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
      <a role="button" href="/" className="btn btn-link btn-sm" onClick={linkHandler("/", push)}>
        <HouseDoor className={styles.outermostIcon} />
      </a>
      {isUserSigned ? (
        <div className="hstack ms-sm-4 ms-lg-5">
          <a
            role="button"
            className={`btn btn-link btn-sm me-1 me-sm-4 me-lg-5 ${
              pathname == "/rooms" ? styles.navLinkOpen : ""
            }`}
            style={{ textDecoration: "none" }}
            href="/rooms"
            onClick={linkHandler("/rooms", push)}
          >
            <strong className={styles.navLinkText}>Rooms</strong>
          </a>
          <a
            role="button"
            className={`btn btn-link btn-sm ${
              pathname == "/invitations" ? styles.navLinkOpen : ""
            }`}
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
            <Sun color="black" className={styles.darkModeIcon} />
          </button>
        )}
        <div className="d-flex">
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
          <div
            className={`${styles.firstSingInPopover}`}
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="bottom"
            data-bs-trigger="manual"
            data-bs-custom-class={styles.firstSingInPopoverText}
            data-bs-title="Try your bots to test chat rooms"
            data-bs-content="Click anywhere to close"
            ref={popoverRef}
          ></div>
        </div>
      </div>
    </div>
  );
}
