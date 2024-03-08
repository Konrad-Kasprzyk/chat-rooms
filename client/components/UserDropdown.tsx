"use client";

import useWindowSize from "app/hooks/useWindowSize.hook";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import BOOTSTRAP_BREAKPOINTS from "client/constants/bootstrapBreakpoints.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Person } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import UserDropdownItem from "./UserDropdownItem";

export default function UserDropdown() {
  const [username, setUsername] = useState("");
  const [botNumber, setBotNumber] = useState<number | null>(null);
  const { height, width } = useWindowSize();
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
    <Dropdown>
      <Dropdown.Toggle size="sm" variant="link">
        <Person color="black" size={width < BOOTSTRAP_BREAKPOINTS.sm ? 30 : 40} />
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: "min(350px,100vw)" }}>
        <div className="px-2">
          {username ? <div className="mt-2 mb-3 text-center">{username}</div> : null}
          {botNumber === null ? null : (
            <div>
              <Dropdown.Divider />
              <UserDropdownItem />
            </div>
          )}
          {otherBotNumbers.map((otherBotNumber) => (
            <div key={otherBotNumber}>
              <Dropdown.Divider />
              <UserDropdownItem botNumber={otherBotNumber} />
            </div>
          ))}
        </div>
        <Dropdown.Divider />
        <Dropdown.Item className="text-center" href="/account" onClick={() => push("/account")}>
          <Button variant="link" style={{ pointerEvents: "none", textDecoration: "none" }}>
            <strong>Account</strong>
          </Button>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-center" href="/" onClick={() => signOut()}>
          <Button
            variant="outline-danger"
            className="border-0"
            style={{ pointerEvents: "none", textDecoration: "none" }}
          >
            <strong>Log out</strong>
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
