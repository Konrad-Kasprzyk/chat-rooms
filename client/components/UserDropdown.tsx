"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import linkHandler from "client/utils/components/linkHandler.util";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Person } from "react-bootstrap-icons";
import UserDropdownItem from "./UserDropdownItem";
import headerStyles from "./header.module.scss";
import styles from "./userDropdown.module.scss";

export default function UserDropdown() {
  const [username, setUsername] = useState("");
  const [botNumber, setBotNumber] = useState<number | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const { push } = useRouter();

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
        <Person
          color="black"
          className={headerStyles.outermostIcon}
        />
      </button>
      <ul
        className="dropdown-menu"
        style={{ width: "min(350px,100vw)" }}
      >
        <li className="px-2">
          {username ? <div className="mt-2 mb-3 text-center">{username}</div> : null}
          {botNumber === null ? null : (
            <div>
              <hr className="dropdown-divider" />
              <UserDropdownItem />
            </div>
          )}
          {otherBotNumbers.map((otherBotNumber) => (
            <div key={otherBotNumber}>
              <hr className="dropdown-divider" />
              <UserDropdownItem botNumber={otherBotNumber} />
            </div>
          ))}
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a
            className="dropdown-item text-center py-2"
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
            className="dropdown-item text-center py-2"
            onClick={() => signOut().then(() => push("/"))}
          >
            <strong className="text-danger">Log out</strong>
          </button>
        </li>
      </ul>
    </div>
  );
}
