"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HouseDoor } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Stack from "react-bootstrap/esm/Stack";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const { push } = useRouter();

  // console.log(getSignedInUserId());
  // console.log(isUserSigned);

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
    <Container fluid>
      <Row>
        <Col xs="auto">
          {/* <Button variant="link" onClick={() => push("/")}> */}
          <Button size="sm" variant="outline-primary" className="m-1" onClick={() => push("/")}>
            <HouseDoor color="royalblue" size={40} />
          </Button>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <div>Room Title if opened</div>
        </Col>
        <Col xs="auto" className="d-flex  align-items-center me-3">
          {isUserSigned ? (
            <UserDropdown />
          ) : (
            <Stack direction="horizontal" gap={4}>
              <Button variant="outline-primary" onClick={() => push("/login")}>
                Log In
              </Button>
              <Button onClick={() => push("/signup")}>Sign Up</Button>
            </Stack>
          )}
        </Col>
      </Row>
    </Container>
  );
}
