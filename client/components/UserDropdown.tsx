"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Person } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/esm/Dropdown";
import UserDropdownItem from "./UserDropdownItem";

export default function UserDropdown() {
  const [username, setUsername] = useState("");
  const [botNumber, setBotNumber] = useState<number | null>(null);
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
      <Dropdown.Toggle size="sm" variant="outline-primary">
        <Person color="black" size={40} />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" style={{ maxWidth: "80vw" }}>
        <div className="px-2" style={{ minWidth: "400px" }}>
          {username ? <div className="text-center">{username}</div> : null}
          {botNumber === null ? null : <UserDropdownItem />}
          {otherBotNumbers.map((otherBotNumber) => (
            <UserDropdownItem key={otherBotNumber} botNumber={otherBotNumber} />
          ))}
        </div>
        <Dropdown.Divider />
        <Dropdown.Item className="text-center" onClick={() => push("/account")}>
          Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-center" onClick={() => signOut()}>
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
