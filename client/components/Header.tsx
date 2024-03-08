"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isUserSigned, setIsUserSigned] = useState(false);
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
      className="d-flex justify-content-between align-items-center mt-1 mx-1 mx-sm-3"
    >
      <Button size="sm" variant="outline-primary" onClick={() => push("/")}>
        <HouseDoor color="black" size={40} />
      </Button>
      <Stack direction="horizontal" className="mx-1 mx-sm-5">
        <Button className="me-1 me-sm-5" variant="outline-primary" onClick={() => push("/rooms")}>
          Rooms
        </Button>
        <Button variant="outline-primary" onClick={() => push("/invitations")}>
          Invitations
        </Button>
      </Stack>
      {isUserSigned ? <UserDropdown /> : <Button onClick={() => push("/signin")}>Sign In</Button>}
    </Stack>
  );
}
