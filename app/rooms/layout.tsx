"use client";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Row from "react-bootstrap/esm/Row";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Nav
            className="d-flex justify-content-center"
            variant="underline"
            defaultActiveKey="/chat"
          >
            <Nav.Item>
              <Nav.Link href="/chat">Chat</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-4">
              <Nav.Link href="/members">Members</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col>{children}</Col>
      </Row>
    </Container>
  );
}
