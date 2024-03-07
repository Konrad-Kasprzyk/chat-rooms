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
            <Button onClick={() => push("/signin")}>Sign In</Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
