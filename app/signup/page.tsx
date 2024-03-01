"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";

export default function SignUp() {
  let email = "";
  let username = "";
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLInputElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Stack gap={3} className="col-sm-6 col-md-3 mx-auto">
      <Button className="p-2">Sign up with Google</Button>
      <Button className="p-2">Sign up with GitHub</Button>
      <Form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          console.log(email);
          console.log(username);
        }}
      >
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e: ChangeEvent<HTMLInputElement>) => (email = e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Username"
            onChange={(e: ChangeEvent<HTMLInputElement>) => (username = e.target.value)}
          />
          <Form.Control.Feedback type="invalid">Please provide a username.</Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign up with Email
        </Button>
      </Form>
    </Stack>
  );
}
