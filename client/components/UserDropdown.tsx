"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import linkHandler from "client/utils/components/linkHandler.util";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Person, QuestionCircle } from "react-bootstrap-icons";
import UserDropdownItem from "./UserDropdownItem";
import headerStyles from "./header.module.scss";
import styles from "./userDropdown.module.scss";

export default function UserDropdown() {
  const [username, setUsername] = useState("");
  const [botNumber, setBotNumber] = useState<number | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { push } = useRouter();

  useEffect(() => {
    // @ts-ignore: This is a valid path for Bootstrap javascript
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      if (!tooltipRef.current) {
        console.error("Tooltip reference inside the user account dropdown is null");
        return;
      }
      new bootstrap.Tooltip(tooltipRef.current);
    });
  }, []);

  useEffect(() => {
    const signedInUserSubscription = listenCurrentUser().subscribe((user) => {
      if (!user?.username) setUsername("");
      else if (username !== user.username) setUsername(user.username);
    });
    const signedInUserDetailsSubscription = listenCurrentUserDetails().subscribe((userDetails) => {
      if ((userDetails === null || userDetails.botNumber === null) && botNumber != null)
        setBotNumber(null);
      else if (userDetails && botNumber !== userDetails.botNumber)
        setBotNumber(userDetails.botNumber);
    });
    return () => {
      signedInUserSubscription.unsubscribe();
      signedInUserDetailsSubscription.unsubscribe();
    };
  }, [username, botNumber]);

  const otherBotNumbers = [];
  for (let i = 0; i < USER_BOTS_COUNT; i++) if (botNumber !== i) otherBotNumbers.push(i);

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-link btn-sm dropdown-toggle"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        ref={dropdownButtonRef}
        aria-expanded="false"
      >
        <Person className={headerStyles.outermostIcon} />
      </button>
      <ul className="dropdown-menu" style={{ width: "min(350px,100vw)" }}>
        <li className="px-2">
          {username ? <div className="mt-2 mb-2 text-center text-truncate">{username}</div> : null}
          <div className="d-flex align-items-start">
            <div
              className="d-flex align-items-start"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-title="Chat with your personal bots. Try switching in another tab!"
              ref={tooltipRef}
            >
              <QuestionCircle />
            </div>
            <div className="vstack ms-1">
              <hr className="dropdown-divider" />
            </div>
          </div>
          {botNumber === null ? null : (
            <div>
              <UserDropdownItem />
              <hr className="dropdown-divider" />
            </div>
          )}
          {otherBotNumbers.map((otherBotNumber, index) => (
            <div key={otherBotNumber}>
              <UserDropdownItem botNumber={otherBotNumber} />
              {index == otherBotNumbers.length - 1 ? null : <hr className="dropdown-divider" />}
            </div>
          ))}
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a
            className="dropdown-item btn btn-primary text-center py-2"
            href="/account"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (dropdownButtonRef.current) dropdownButtonRef.current.click();
              linkHandler("/account", push)(e);
            }}
          >
            <strong className={`${styles.accountLinkText} text-primary`}>Account</strong>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            type="button"
            className="dropdown-item btn btn-danger text-center py-2"
            onClick={() => signOut().then(() => push("/"))}
          >
            <strong className="text-danger">Log out</strong>
          </button>
        </li>
      </ul>
    </div>
  );
}
