"use client";

import Button from "react-bootstrap/esm/Button";

export default function Home() {
  return (
    <div className="d-flex justify-content-center" style={{ marginTop: "20vh" }}>
      <div>
        <p className="text-primary mb-0">sample</p>
        <h1 className="text-primary display-2 text-center">Chat Rooms</h1>
        <div className="d-flex justify-content-center mt-5">
          <Button size="lg">Try with anonymous account</Button>
        </div>
      </div>
    </div>
  );
}
